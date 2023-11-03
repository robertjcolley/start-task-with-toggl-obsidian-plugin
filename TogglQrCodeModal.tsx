import { Modal, App } from 'obsidian'
import { Root, createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import QRCode from 'react-qr-code'
import { ModifierKey } from 'settings'

export class TogglQrCodeModal extends Modal {
  root: Root | null
  task: string
  workspaceId: string
  modifierKey: ModifierKey

  constructor(
    app: App,
    task: string,
    workspaceId: string,
    modifierKey: ModifierKey
  ) {
    super(app)
    this.task = task
    this.workspaceId = workspaceId
    this.modifierKey = modifierKey
  }

  onOpen() {
    const { contentEl } = this
    const modal = contentEl.createEl('div')

    modal.createEl('h1', {
      text: 'Start in Toggl',
    })
    const rootDiv = modal.createDiv({ attr: { id: 'qr-code-react-root' } })
    // TODO: Add Project ID and fetch projects from Toggl API
    // const pid = this.projectId ? `&pid=${this.projectId}` : ''
    // const togglUrl = `https://track.toggl.com/timer/start?wid=${
    //   this.workspaceId
    // }&desc=${encodeURIComponent(this.task)}${pid}`
    const togglUrl = `https://track.toggl.com/timer/start?wid=${
      this.workspaceId
    }&desc=${encodeURIComponent(this.task)}`
    this.root = createRoot(rootDiv)
    this.root.render(
      <StrictMode>
        <div
          style={{
            height: 'auto',
            margin: '0 auto',
            maxWidth: 64,
            minHeight: 200,
            minWidth: 200,
            width: '100%',
          }}
        >
          <QRCode
            size={256}
            style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
            value={togglUrl}
            viewBox={`0 0 256 256`}
          />
        </div>
      </StrictMode>
    )

    modal
      .createEl('button', {
        attr: { type: 'button' },
        text: 'Done',
      })
      .addEventListener('click', () => {
        this.close()
      })
  }

  onClose() {
    const { contentEl } = this
    contentEl.empty()
  }
}
