import TogglQrCodePlugin from 'main'
import { App, PluginSettingTab, Setting, normalizePath } from 'obsidian'

export type ModifierKey = 'shiftKey' | 'altKey' | 'ctrlKey'

export interface TogglQrCodeSettingsDefinition {
  workspaceId: string | null
  modifierKey: ModifierKey
}

export const DEFAULT_SETTINGS: TogglQrCodeSettingsDefinition = {
  workspaceId: null,
  modifierKey: 'shiftKey',
}

export class TogglQrCodeSettings extends PluginSettingTab {
  plugin: TogglQrCodePlugin

  constructor(app: App, plugin: TogglQrCodePlugin) {
    super(app, plugin)
    this.plugin = plugin
  }

  sanitiseNote(value: string): string {
    // Taken from homepage plugin
    if (value === null || value.match(/^\s*$/) !== null) {
      return ''
    }
    return normalizePath(value)
  }

  display(): void {
    const { containerEl } = this

    containerEl.empty()
    containerEl.createEl('h1', { text: 'Toggl Start with QR Code settings' })
    // TODO: Link to Toggl
    // const text1 = createEl('span')
    // text1.innerText = 'Visit '
    // const link = createEl('a')
    // link.href = 'https://track.toggl.com/organization'
    // link.innerText = 'https://track.toggl.com/organization'
    // const text2 = createEl('span')
    // text2.innerText = ' to view your workspaces.'

    // const description = createEl('span')
    // description.appendChild(text1)
    // description.appendChild(link)
    // description.appendChild(text2)

    new Setting(this.containerEl)
      .setName('Workspace ID')
      .setDesc(
        'Visit https://track.toggl.com/organization and view your workspaces'
      )
      .addText((text) => {
        text
          .setPlaceholder('1234567890')
          .setValue(
            this.plugin.settings.workspaceId
              ? this.plugin.settings.workspaceId
              : ''
          )
          .onChange(async (value) => {
            this.plugin.settings.workspaceId =
              this.sanitiseNote(value) || DEFAULT_SETTINGS.workspaceId
            await this.plugin.saveSettings()
          })
      })

    new Setting(this.containerEl)
      .setName('Modifier Key')
      .setDesc('Choose which key to hold while clicking a task')
      .addDropdown((dropdown) => {
        dropdown.addOptions({
          shiftKey: 'Shift',
          ctrlKey: 'Control',
          altKey: 'Alt',
        })
        console.log(this.plugin.settings.modifierKey)
        console.log(dropdown.getValue())
        dropdown.setValue(this.plugin.settings.modifierKey)
        dropdown.onChange(async (value: ModifierKey) => {
          this.plugin.settings.modifierKey = value
          await this.plugin.saveSettings()
        })
      })
  }
}
