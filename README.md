Gnome 3 Window Buttons Extension
================================

This is an exntesion for Gnome 3 which puts minimize, maximize and close buttons in the top panel.

Supports custom button layouts and css theming!

You have to restart gnome-shell to apply a new theme properly.

Currently the buttons only control the active window.

Settings are _org.gnome.shell.extensions.window-buttons_ in **dconf-editor**

Installation
------------

Copy the schema file (org.gnome.shell.extensions.window-buttons.gschema.xml) to _/usr/share/glib-2.0/schemas_

Run "#glib-compile-schemas /usr/share/glib-2.0/schemas" as root

Copy the "window_buttons@biox.github.com" folder to ~/.local/share/gnome-shell/extensions or /usr/share/gnome-shell/extensions

To-do
-----

- Add unfocused window support for better theming
- Add option to handle only maximized windows
