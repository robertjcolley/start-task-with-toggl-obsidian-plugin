import { Notice, Plugin } from 'obsidian'
import { TogglQrCodeModal } from './TogglQrCodeModal'
import {
  DEFAULT_SETTINGS,
  TogglQrCodeSettings,
  TogglQrCodeSettingsDefinition,
} from 'settings'

export default class TogglQrCodePlugin extends Plugin {
  settings: TogglQrCodeSettingsDefinition

  showQrCode(task: string) {
    return new Promise<void>((resolve, reject) => {
      try {
        if (!this.settings.workspaceId) {
          new Notice('Toggl workspace ID not set. Please update the settings.')
          resolve()
        } else if (task.trim() === '') {
          new Notice('Unable to show QR code for empty task.')
          resolve()
        } else {
          const modal = new TogglQrCodeModal(
            this.app,
            task,
            this.settings.workspaceId,
            this.settings.modifierKey
          )
          modal.onClose = () => {
            resolve()
          }
          modal.open()
        }
      } catch (e) {
        reject()
      }
    })
  }

  async onload() {
    await this.loadSettings()

    this.addSettingTab(new TogglQrCodeSettings(this.app, this))

    const callback = (e: MouseEvent) => {
      if (
        e[this.settings.modifierKey] &&
        e.target instanceof HTMLInputElement &&
        e.target.type === 'checkbox' &&
        e.target.checked
      ) {
        e.preventDefault()
        // Check where task name is, depends on if is using Obsidian Tasks or not
        const text =
          ((e.target.parentNode as HTMLInputElement)?.innerText.length ?? 0) > 0
            ? (e.target.parentNode as HTMLInputElement).innerText
            : (
                (e.target.parentNode as HTMLSpanElement)
                  .parentNode as HTMLInputElement
              ).innerText

        this.showQrCode(text)
      }
    }

    window.addEventListener('click', callback, { capture: true }) // Adding like this instead of registerDomEvent as can't use the "capture"-option with it. Capture needed as Obsidian-tasks stops propagation.

    // This registers the unload function
    this.register(() =>
      window.removeEventListener('click', callback, { capture: true })
    )
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData())
  }

  async saveSettings() {
    await this.saveData(this.settings)
  }
}
