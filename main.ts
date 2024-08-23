import { App, Editor, MarkdownPostProcessorContext, MarkdownRenderChild, MarkdownView, Notice, Plugin, TFile, Vault } from 'obsidian';
import { DEFAULT_SETTINGS } from 'src/Constants';
import MyPluginSettings from 'src/MyPluginSettings';
import SampleModal from 'src/SampleModal';
import SampleSettingTab from 'src/SampleSettingTab';

// Remember to rename these classes and interfaces!

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();

		const { vault } = this.app;

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('dice', 'Sample Plugin', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			new Notice(this.settings.mySetting);
		});
		// Perform additional things with the ribbon
		ribbonIconEl.addClass('my-plugin-ribbon-class');

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText('Initial');

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'open-sample-modal-simple',
			name: 'Open sample modal (simple)',
			callback: () => {
				new SampleModal(this.app).open();
			}
		});
		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: 'sample-editor-command',
			name: 'Sample editor command',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				console.log(editor.getSelection());
				editor.replaceSelection('Sample Editor Command');
			}
		});
		// This adds a complex command that can check whether the current state of the app allows execution of the command
		this.addCommand({
			id: 'open-sample-modal-complex',
			name: 'Open sample modal (complex)',
			checkCallback: (checking: boolean) => {
				// Conditions to check
				const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					// If checking is true, we're simply "checking" if the command can be run.
					// If checking is false, then we want to actually perform the operation.
					if (!checking) {
						new SampleModal(this.app).open();
					}

					// This command will only show up in Command Palette when the check function returns true
					return true;
				}
			}
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
		// ----------------------------------------------- My code
		this.registerEvent(this.app.vault.on('modify', (x) => {
			console.log('modify')
		  }));
		// this.registerInterval(window.setInterval(() => statusBarItemEl.setText(Date.now().toString()), 1000));
        this.registerMarkdownCodeBlockProcessor('myblock', (source, el, ctx) => {

			const filePath = ctx.sourcePath;
			
            // Create a new instance of MyMarkdownRenderChild
            const child = new MyMarkdownRenderChild(el, filePath, this.app );
            // Add it to the context so it gets managed properly
            ctx.addChild(child);
        });
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

// Custom MarkdownRenderChild class
class MyMarkdownRenderChild extends MarkdownRenderChild {
    private filePath: string;
	private app: App;
	
    constructor(containerEl: HTMLElement, filePath: string, app: App) {
        super(containerEl);
		this.filePath = filePath;
		this.app = app;
		
    }

    onload() {
		//Static part. Not updated
		const staticElement = this.containerEl.createEl('div');
		staticElement.textContent = `${this.filePath}`;
		
        // Create an element to display the time
        const timeElement = this.containerEl.createEl('div');
        this.updateContent(timeElement);

        // Update the content every second
        this.registerInterval(window.setInterval(() => {
            this.updateContent(timeElement);
        }, 1000));
    }

    // Function to update the content of the timeElement
    private updateContent(timeElement: HTMLElement) {
		console.log("updateContent");
        const now = new Date();
        timeElement.textContent = `Current time: ${now.toLocaleTimeString()}`;

		// Write to file

		// const file = this.app.vault.getFileByPath(this.filePath);
		// if(file !== null){
		// 	debugger;
		// 	this.app.vault.process(file, (data) => {
		// 		return data.replace(
		// 			            /```myblock[\s\S]*?```/g,
        //     `\`\`\`myblock\n${now.toLocaleTimeString()}\n\`\`\``
		// 		);
		// 	  })
		// }
    }
}