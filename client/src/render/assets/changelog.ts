export interface ChangeLogItem {
  version: string;
  date: number;
  changes: {
    title: string;
    changes: string[];
  }[]
}

export const changeLog: ChangeLogItem[] = [
  {
    version: "1.5.0-alpha.1",
    date: 1784332800000,
    changes: [
      {
        title: "osu!lazer",
        changes: [
          "Added a persistent osu!stable and osu!lazer client switch",
          "Added read-only client.realm library detection through a bundled helper",
          "Added separate lazer data, executable, and import staging locations",
          "Added explicit .osz importing with Realm confirmation before staged files are removed",
          "Disabled stable collection operations while lazer mode is active",
        ],
      },
      {
        title: "Verification",
        changes: [
          "Added packaged-helper and installed-helper smoke tests",
          "Added an isolated packaged-interface test for switching into lazer mode",
        ],
      },
    ],
  },
  {
    version: "1.4.0-alpha.10",
    date: 1784332800000,
    changes: [
      {
        title: "Interface text",
        changes: [
          "Removed promotional headlines and labels",
          "Replaced vague descriptions with direct instructions",
          "Renamed preset searches and empty states to describe their function",
        ],
      },
    ],
  },
  {
    version: "1.4.0-alpha.9",
    date: 1784332800000,
    changes: [
      {
        title: "Interface",
        changes: [
          "Removed the oversized 01 decoration from Overview",
          "Removed the oversized LOG decoration from Release Notes",
          "Kept the flat blue-charcoal layout and readability palette unchanged",
        ],
      },
    ],
  },
  {
    version: "1.4.0-alpha.8",
    date: 1784332800000,
    changes: [
      {
        title: "Readability",
        changes: [
          "Lifted the near-black canvas to a softer blue-charcoal palette",
          "Brightened secondary text, navigation descriptions, metadata, and disabled controls",
          "Made dividers, input surfaces, tables, and inactive navigation easier to distinguish",
          "Softened pure-white interface text to reduce glare against the dark background",
        ],
      },
      {
        title: "Design",
        changes: [
          "Preserved the flat section-based alpha7 layout without bringing cards or capsules back",
          "Retained semantic green, red, amber, and blue states while reducing overall contrast fatigue",
        ],
      },
    ],
  },
  {
    version: "1.4.0-alpha.7",
    date: 1784332800000,
    changes: [
      {
        title: "Interface",
        changes: [
          "Replaced decorative cards with open sections, metric rails, dividers, and edge-to-edge rows",
          "Removed capsule styling from status labels and counters",
          "Rebuilt navigation as a compact desktop rail with a blue active marker",
          "Flattened search filters, download jobs, service metrics, and release history",
        ],
      },
      {
        title: "Visual language",
        changes: [
          "Introduced square controls, tabular telemetry, restrained blue rules, and stronger spacing",
          "Kept boxes only where they communicate an actual input, button, table, or modal boundary",
        ],
      },
    ],
  },
  {
    version: "1.4.0-alpha.6",
    date: 1784332800000,
    changes: [
      {
        title: "Interface",
        changes: [
          "Replaced the purple accent system with a modern blue design throughout the application",
          "Reworked the application icon in blue to match the updated identity",
          "Kept health and warning colors semantic instead of tinting every state blue",
        ],
      },
      {
        title: "Service health",
        changes: [
          "Fixed the sidebar service indicator being overridden by the generic pill style",
          "Made online explicitly green, offline explicitly red, and the initial check neutral",
        ],
      },
    ],
  },
  {
    version: "1.4.0-alpha.5",
    date: 1784332800000,
    changes: [
      {
        title: "Installer",
        changes: [
          "Fixed Windows shortcuts targeting an executable that did not exist",
          "Fixed Add or remove programs metadata using the wrong executable name",
          "Added a clean-install test that launches the application through the installed NSIS layout",
          "Added automated verification of the desktop shortcut target",
        ],
      },
    ],
  },
  {
    version: "1.4.0-alpha.4",
    date: 1784332800000,
    changes: [
      {
        title: "Setup",
        changes: [
          "Replaced the Squirrel package with an NSIS setup wizard",
          "Added a selectable Windows installation folder",
          "Moved automatic update support to the NSIS-compatible updater",
        ],
      },
      {
        title: "Interface",
        changes: [
          "Fixed the Project on GitHub button",
          "Made service health refresh automatically with green and red states",
          "Moved the osu! installation warning to the top of Overview",
          "Increased small labels, descriptions, and muted-text contrast",
        ],
      },
    ],
  },
  {
    version: "1.4.0-alpha.3",
    date: 1784332800000,
    changes: [
      {
        title: "Reliability",
        changes: [
          "Fixed the packaged application opening to a blank window",
          "Separated main-process native module handling from the renderer build",
          "Added an automated packaged-interface startup test to release checks",
        ],
      },
    ],
  },
  {
    version: "1.4.0-alpha.2",
    date: 1784332800000,
    changes: [
      {
        title: "Design",
        changes: [
          "Refined the interface with flatter surfaces and fewer decorative effects",
          "Made service health use clear green and red status treatments",
          "Replaced the original application artwork with a new community icon",
        ],
      },
      {
        title: "Platform",
        changes: [
          "Moved the renderer to React 19, Material UI 9, React Router 7, and Tailwind CSS 4",
          "Updated the compiler and lint foundation to TypeScript 6 and ESLint 10",
          "Gave the community build its own executable, installer, package, and Windows metadata",
        ],
      },
    ],
  },
  {
    version: "1.4.0-alpha.1",
    date: 1784332800000,
    changes: [
      {
        title: "Interface",
        changes: [
          "Rebuilt the complete desktop interface",
          "Introduced new overview, discovery, downloads, service, and release-note workspaces",
          "Redesigned query controls, result review, transfer setup, and queue activity",
          "Consolidated interface styling into one consistent design system",
        ],
      },
      {
        title: "Project",
        changes: [
          "Moved release ownership to the community fork",
          "Updated the Electron runtime and packaging toolchain",
          "Added reproducible Windows checks and release automation",
          "Made inherited service dependencies explicit in the interface and documentation",
        ],
      },
    ],
  },
  {
    version: "1.3.0",
    date: 1669446685871,
    changes: [
      {
        title: "Server",
        changes: [
          "Added all unranked beatmaps to the database",
          "Improved performance of querying",
          "Fixed unranked map filter",
          "V2 metrics and filter API",
          "Added ranked mapper special filter",
          "Added script to fetch new beatmaps",
          "Added script to update existing beatmap data",
          "Improved security"
        ]
      },
      {
        title: "Search",
        changes: [
          "Added 'Simple Query' mode",
          "Added share filter feature",
          "Renamed farm and stream filters under 'special'",
          "Added ordering when query limit is enabled",
        ]
      },
      {
        title: "Downloads",
        changes: [
          "Added temporary download folder support",
          "Added custom download client",
          "Added support for multiple downloads",
          "Improved download time estimation",
        ]
      },
      {
        title: "Client",
        changes: [
          "Added categories to changelog",
          "Added discord and donation links",
          "Various UI improvements",
        ],
      }
    ]
  },
  {
    version: "1.2.0",
    date: 1654838371361,
    changes: [
      {
        title: "Server",
        changes: [
          "Added tournament maps from 2019-2021 to the database",
          "Moved beatmap storage to Cloudflare R2",
        ],
      },
      {
        title: "Search",
        changes: [
          "Added support for concurrent downloads",
          "Added tournament archetypes to the query selector",
        ],
      },
      {
        title: "Client",
        changes: [
          "Added changelog",
        ],
      }
    ]
  }
]

