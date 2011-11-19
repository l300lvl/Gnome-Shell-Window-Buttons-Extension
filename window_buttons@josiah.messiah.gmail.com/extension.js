// Copyright (C) 2011 Josiah Messiah (josiah.messiah@gmail.com)
// Licence: GPLv3

const Lang = imports.lang;
const St = imports.gi.St;
const Wnck = imports.gi.Wnck;
const Main = imports.ui.main;
const Gio = imports.gi.Gio;
const GConf = imports.gi.GConf;

let extensionPath = ""

// Settings
const WA_SETTINGS_SCHEMA = 'org.gnome.shell.extensions.window-buttons';
const WA_PINCH = 'pinch';
const WA_ORDER = 'order';
const WA_THEME = 'theme';

// Keep enums in sync with GSettings schemas

const PinchType = {
    CUSTOM: 0,
    MUTTER: 1,
    METACITY: 2
};


let pinch = 1
let order = ":minimize,maximize,close"
let theme = "default"


function WindowButtons() {
	this._init();
}

WindowButtons.prototype = {

	_init: function() {
		
		//Load Settings
		this._settings = new Gio.Settings({ schema: WA_SETTINGS_SCHEMA });
        theme = this._settings.get_string(WA_THEME);
        pinch = this._settings.get_enum(WA_PINCH);
        if (pinch == 0) {
			order = this._settings.get_string(WA_ORDER);
		} else if (pinch == 1) {
			order = GConf.Client.get_default().get_string("/desktop/gnome/shell/windows/button_layout");
		} else if (pinch == 2) {
			order = GConf.Client.get_default().get_string("/apps/metacity/general/button_layout");
		}

		this.rightActor = new St.Bin({ style_class: 'box-bin panel-button', reactive: false, track_hover: false });
		this.rightBox = new St.BoxLayout({ style_class: 'button-box' });
		this.leftActor = new St.Bin({ style_class: 'box-bin panel-button', reactive: false, track_hover: false });
		this.leftBox = new St.BoxLayout({ style_class: 'button-box' });

		this.screen = new Wnck.Screen.get_default()

		this._loadTheme();

		this._display();
		
	},
	

	_loadTheme: function() {
		
		let themeContext = St.ThemeContext.get_for_stage(global.stage);
		let currentTheme = themeContext.get_theme();
		
		currentTheme.load_stylesheet(extensionPath + '/themes/' + theme + '/style.css');
		
	},

	_display: function() {

		let buttonlist = { 	minimize : ['Minimize', this._minimize], 
							maximize : ['Maximize', this._maximize], 
							close    : ['Close', this._close] } ;
		
		let orders = order.split(':')
		let orderLeft  = orders[0].split(',')
		let orderRight = orders[1].split(',')

		if (orderRight != "") {
			for ( let i=0; i<orderRight.length; ++i ) {
				let button = new St.Button({ style_class: 'window-button ' + orderRight[i] , reactive: true } ); 
				button.set_tooltip_text( buttonlist[orderRight[i]][0] );
				button.connect('button-press-event', Lang.bind(this, buttonlist[orderRight[i]][1]));
				this.rightBox.add(button);
			}
		}
		
		if (orderLeft != "") {
			for ( let i=0; i<orderLeft.length; ++i ) {
				let button = new St.Button({ style_class: 'window-button ' + orderLeft[i] , reactive: true } ); 
				button.set_tooltip_text( buttonlist[orderLeft[i]][0] );
				button.connect('button-press-event', Lang.bind(this, buttonlist[orderLeft[i]][1]));
				this.leftBox.add(button);
			}
		}
		
		this.rightActor.add_actor(this.rightBox)
		this.leftActor.add_actor(this.leftBox)

	},

	
	_minimize: function() {
		global.display.focus_window.minimize()
	},
		
	_maximize: function() {

		let activeWindow = this.screen.get_active_window()

		if (activeWindow) {
		// (Un)maximize the active window
			if (activeWindow.get_state() == 6) {
				activeWindow.unmaximize()
			} else {
				activeWindow.maximize()
			}
		}

		// Unmaximizes the topmost maximized window instead of just the active one

		//if (activeWindow) {
			//if (activeWindow.get_state() == 6) {
				//activeWindow.unmaximize()
			//} else {
				
				//let windows = this.screen.get_windows_stacked()
				
				//let maxbehind = false
				//for ( let i=windows.length-1; i>=0; --i ) {
					//if (windows[i].get_state() == 6) {
						//windows[i].unmaximize()
						//activeWindow.activate(global.get_current_time())
						//maxbehind = true
						//break
					//}
				//}
				//if (!maxbehind) {activeWindow.maximize()}
			//}			
		//} else {
			//this.screen.get_windows_stacked()[0].maximize()
		//}
	},
	
	_close: function() {
		global.display.focus_window.delete(global.get_current_time())
	},


	enable: function() {
		let children = Main.panel._rightBox.get_children();
		Main.panel._rightBox.insert_actor(this.rightActor, children.length);
		Main.panel._leftBox.insert_actor(this.leftActor, 0);
	},

	disable: function() {
		Main.panel._rightBox.remove_actor(this.actor);
	}
};

function init(extensionMeta) {
	extensionPath = extensionMeta.path;
	return new WindowButtons();
}
