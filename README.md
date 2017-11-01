# vscode-mbed

[![Marketplace Version](https://vsmarketplacebadge.apphb.com/version-short/semonec.vscode-mbed.svg)](https://marketplace.visualstudio.com/items?itemName=semonec.vscode-mbed) [![Installs](https://vsmarketplacebadge.apphb.com/installs-short/semonec.vscode-mbed.svg)](https://marketplace.visualstudio.com/items?itemName=semonec.vscode-mbed) [![Rating](https://vsmarketplacebadge.apphb.com/rating-short/semonec.vscode-mbed.svg)](https://marketplace.visualstudio.com/items?itemName=semonec.vscode-mbed)

Arm mbed development IDE kit for VS Code

## Commands


## Commands

* `new` - Create a new ARMmbed project
* `compile` - Compile current ARMmbed project
* `flash` - Flash current ARMmbed project's binary into board.

## Configuration

|Name                           |Type       |Description
|-------------------------------|-----------|-----------
|`mbed.mcu`                     |`string`   |Select a target. If `detect` or `auto` parameter is passed to `-m`, then Mbed CLI detects the connected target.
|`mbed.toolchain`               |`string`   |Select a toolchain (of those defined in `mbed_settings.py`, see above). The value can be `ARM` (Arm Compiler 5), `GCC_ARM` (GNU Arm Embedded) or `IAR` (IAR Embedded Workbench for Arm).
|`mbed.source`                  |`string`   |Select the source directory. The default is `.` (the current directory). You can specify multiple source locations, even outside the program tree.
|`mbed.build`                   |`string`   |Select the build directory. Default: `BUILD/` inside your program root.
|`mbed.profile`                 |`string`   |Select a path to a build profile configuration file. Example: `mbed-os/tools/profiles/debug.json`.
|`mbed.library`                 |`boolean`  |Compile the code as a [static .a/.ar library](https://github.com/ARMmbed/mbed-cli#compiling-static-libraries).


Check details at  [MBED cli](https://github.com/ARMmbed/mbed-cli)

## Activation

This extension is activated automatically.

By detecting following files exist in your workspace

* `.mbed`
* `.mbed_settings.py`
* `mbed_app.json`

Or, Creating new ARM mbed project will activate this extension.

## Status bar icons

* ![check](images/compile.png)  Compile current project
* ![check](images/flash.png) Flash current project's binary into board
* ![check](images/terminal.png) Show serial monitor



## Contributing

1. Fork it!
2. Create your feature branch: git checkout -b my-new-feature
3. Commit your changes: git commit -am 'Add some feature'
4. Push to the branch: git push origin my-new-feature
5. Submit a pull request :D

## Credits

* [Visual Studio Code](https://code.visualstudio.com/)
* [vscode-docs on GitHub](https://github.com/Microsoft/vscode-docs)

## License

[MIT](LICENSE)


## Release Note

### 0.2.0
- From now on, checking mbed installation status
- Activate only mbed project workspace
- Added configuration for workspace(or global, but prefer to set workspace)

### 0.1.0

Initial release of mbed-cli replacement

- ext command with **`MBED: New`**
  - Create new mbed project into specific folder with project name
- ext command with **`MBED: Compile`**
  - Compile current project as connected mbed board
- ext command with **`MBED: Flash`**
  - Compile and flash current project into connected mbed board
- ext command with **`MBED: Open serial monitor`**
  - Show serial monitor *developing*


