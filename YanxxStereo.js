/**
 * @name YanxxStereoTest2
 * @version 2
 * @authorLink https://github.com/YYanxx
 * @source https://github.com/YYanxx/YanxxPlugins.git
 */
/*@cc_on
@if (@_jscript)
	
	// Offer to self-install for clueless users that try to run this directly.
	var shell = WScript.CreateObject("WScript.Shell");
	var fs = new ActiveXObject("Scripting.FileSystemObject");
	var pathPlugins = shell.ExpandEnvironmentStrings("%APPDATA%\\BetterDiscord\\plugins");
	var pathSelf = WScript.ScriptFullName;
	// Put the user at ease by addressing them in the first person
	shell.Popup("It looks like you've mistakenly tried to run me directly. \n(Don't do that!)", 0, "I'm a plugin for BetterDiscord", 0x30);
	if (fs.GetParentFolderName(pathSelf) === fs.GetAbsolutePathName(pathPlugins)) {
		shell.Popup("I'm in the correct folder already.", 0, "I'm already installed", 0x40);
	} else if (!fs.FolderExists(pathPlugins)) {
		shell.Popup("I can't find the BetterDiscord plugins folder.\nAre you sure it's even installed?", 0, "Can't install myself", 0x10);
	} else if (shell.Popup("Should I copy myself to BetterDiscord's plugins folder for you?", 0, "Do you need some help?", 0x34) === 6) {
		fs.CopyFile(pathSelf, fs.BuildPath(pathPlugins, fs.GetFileName(pathSelf)), true);
		// Show the user where to put plugins in the future
		shell.Exec("explorer " + pathPlugins);
		shell.Popup("I'm installed!", 0, "Successfully installed", 0x40);
	}
	WScript.Quit();

@else@*/

module.exports = (() => {
    const config = {"main":"index.js","info":{"name":"YanxxStereo","authors":[{"name":"By Yanxx","discord_id":"729397565065527306","":""}],"authorLink":"","version":"1","description":"Custom Stereo Plugin By Yanxx There Will Be More In The Future.","https://github.com/YYanxx/YanxxPlugins","github_raw":"https://github.com/YYanxx/YanxxPlugins.git"},"changelog":[{"title":"Changes","items":["Adjusted warning toast behavior"]}],"defaultConfig":[{"type":"switch","id":"enableToasts","name":"Enable Toasts","note":"Allows the plugin to let you know it is working, and also warn you about voice settings","value":true}]};

    return !global.ZeresPluginLibrary ? class {
        constructor() {this._config = config;}
        getName() {return config.info.name;}
        getAuthor() {return config.info.authors.map(a => a.name).join(", ");}
        getDescription() {return config.info.description;}
        getVersion() {return config.info.version;}
        load() {
            BdApi.showConfirmationModal("Library Missing", `The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`, {
                confirmText: "Download Now",
                cancelText: "Cancel",
                onConfirm: () => {
                    require("request").get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", async (error, response, body) => {
                        if (error) return require("electron").shell.openExternal("https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js");
                        await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, r));
                    });
                }
            });
        }
        start() {}
        stop() {}
    } : (([Plugin, Api]) => {
        const plugin = (Plugin, Library) => {
  const { WebpackModules, Patcher, Toasts } = Library;

  return class StereoSound extends Plugin {
    onStart() {
      this.settingsWarning();
      const voiceModule = WebpackModules.getByPrototypes("setSelfDeaf");
      Patcher.after(voiceModule.prototype, "initialize", this.replacement.bind(this));
    }
    settingsWarning() {
      const voiceSettingsStore = WebpackModules.getByProps("getEchoCancellation");
      if (
        voiceSettingsStore.getNoiseSuppression() ||
        voiceSettingsStore.getNoiseCancellation() ||
        voiceSettingsStore.getEchoCancellation()
      ) {
        if (this.settings.enableToasts) {
          Toasts.show(
            "Yanxx Overtalking Stereo",
            { type: "warning", timeout: 1000 }
          );
        }
        // This would not work, noise reduction would be stuck to on
        // const voiceSettings = WebpackModules.getByProps("setNoiseSuppression");
        // 2nd arg is for analytics
        // voiceSettings.setNoiseSuppression(false, {});
        // voiceSettings.setEchoCancellation(false, {});
        // voiceSettings.setNoiseCancellation(false, {});
        return true;
      } else return false;
    }
    replacement(thisObj, _args, ret) {
      const setTransportOptions = thisObj.conn.setTransportOptions;
      thisObj.conn.setTransportOptions = function (obj) {
        if (obj.audioEncoder) {
				obj.audioEncoder.params = { stereo: "1" };
				obj.audioEncoder.channels = 4;
				
			}
			if (obj.fec) {
				obj.fec = false;
				

			}
			if (obj.encodingVoiceBitRate < 1999960000) { 514
				obj.encodingVoiceBitRate = 3224440000
        }
        setTransportOptions.call(thisObj, obj);
      };
      if (!this.settingsWarning()) {
        if (this.settings.enableToasts) {
          Toasts.info("Yanxx Stereo Activated");
        }
      }
      return ret;
    }
    onStop() {
      Patcher.unpatchAll();
    }
    getSettingsPanel() {
      const panel = this.buildSettingsPanel();
      return panel.getElement();
    }
  };
};
        return plugin(Plugin, Api);
    })(global.ZeresPluginLibrary.buildPlugin(config));
})();


/*@end@*/