// Copyright (C) 2011 Josiah Messiah (josiah.messiah@gmail.com)
// Licence: GPLv3

const Lang = imports.lang;
const St = imports.gi.St;
const Wnck = imports.gi.Wnck;
const Main = imports.ui.main;


function WindowButtons() {
	this._init();
}

WindowButtons.prototype = {

	_init: function() {

		this.actor = new St.Bin({ style_class: 'box-bin panel-button', reactive: false, track_hover: false });
		this.box = new St.BoxLayout({ style_class: 'button-box' });

		this.screen = new Wnck.Screen.get_default()

		this._display();
		
	},
	

	_display: function() {

		let buttonlist = [ ['Minimize', this._minimize ], ['Maximize', this._maximize ], ['Close',  this._close ] ];

		for ( let i=0; i<buttonlist.length; ++i ) {
			let button = new St.Button({ style_class: 'window-button ' + buttonlist[i][0] , reactive: false } );
			button.set_tooltip_text(buttonlist[i][0]);
			button.connect('button-press-event', Lang.bind(this, buttonlist[i][1]));
			this.box.add(button);
		}
		
		this.actor.add_actor(this.box)

	},
	
	_minimize: function() {
		global.display.focus_window.minimize()
	},
		
	_maximize: function() {

		let activeWindow = this.screen.get_active_window()


		// (Un)maximize the active window
		if (activeWindow.get_state() == 6) {
			activeWindow.unmaximize()
		} else {
			activeWindow.maximize()
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
		Main.panel._rightBox.insert_actor(this.actor, children.length);
	},

	disable: function() {
		Main.panel._rightBox.remove_actor(this.actor);
	}
};

function init() {
	return new WindowButtons();
}
