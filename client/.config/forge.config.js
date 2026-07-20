const path = require("path");
const package = require("../package.json");
require("dotenv").config();

const packageAssetsPath = path.join(__dirname, "..", "src", "render", "assets");

console.log(packageAssetsPath);

module.exports = {
  packagerConfig: {
    asar: true,
    ...(process.platform === "win32"
      ? {
        extraResource: [
          path.join(__dirname, "..", "bin", "lazer-library-reader", "win-x64", "lazer-library-reader.exe"),
        ],
      }
      : {}),
    appBundleId: "io.github.z9a17.bbd-community",
    icon: path.join(packageAssetsPath, "bbd.ico"),
    executableName: "bbd-community",
    win32metadata: {
      CompanyName: "Batch Beatmap Downloader Community",
      FileDescription: "Batch Beatmap Downloader Community",
      InternalName: "BBDCommunity",
      OriginalFilename: "bbd-community.exe",
      ProductName: "Batch Beatmap Downloader Community",
    },
  },
  publishers: [
    {
      name: "@electron-forge/publisher-github",
      config: {
        repository: {
          owner: "z9a17",
          name: "batch-beatmap-downloader",
          authToken: process.env.GITHUB_TOKEN,
        },
        draft: true,
      },
    },
  ],
  makers: [
    // https://www.electronforge.io/config/makers

    // You can only build the DMG target on macOS machines.
    {
      name: "@electron-forge/maker-dmg",
      platforms: ["darwin"],
      config: {
        // https://js.electronforge.io/maker/dmg/interfaces/makerdmgconfig
        icon: path.join(packageAssetsPath, "bbd.png"),
        overwrite: true,
        name: "BBD Community", // NEEDS TO BE SHORTER THAN 27 CHARACTERS
      },
    },

    // Use maker-zip to build for mac, but without customizability
    // {
    //   name: "@electron-forge/maker-zip",
    //   platforms: ["darwin"],
    //   // No config choice
    // },

    {
      name: "@electron-forge/maker-deb",
      platforms: ["linux"],
      config: {
        // https://js.electronforge.io/maker/deb/interfaces/makerdebconfig
        icon: path.join(packageAssetsPath, "bbd.png"),
      },
    },
  ],
  plugins: [
    {
      name: "@electron-forge/plugin-webpack",
      config: {
        mainConfig: "./.config/webpack.main.config.js",
        renderer: {
          config: "./.config/webpack.renderer.config.js",
          devContentSecurityPolicy: `img-src * 'self' data: https:; default-src 'self' 'unsafe-inline' data:; script-src 'self' 'unsafe-eval';`,
          entryPoints: [
            {
              html: "./src/render/index.html",
              js: "./src/renderer.tsx",
              name: "main_window",
              preload: {
                js: "./src/preload.ts",
              },
            },
          ],
        },
      },
    },
  ],
};
