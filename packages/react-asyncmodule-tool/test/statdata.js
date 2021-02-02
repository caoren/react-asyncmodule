import path from 'path';

export const stats = {
    entrypoints: {
        app: {
            chunks: ['runtime', 'commons', 'libs', 'app'],
            assets: [
                "runtime.js",
                "runtime.js.map",
                'commons.css',
                'commons.js',
                'commons.css.map',
                'commons.js.map',
                'libs.js',
                'libs.js.map',
                'app.js',
                "app.f9ee3a13182e32a778b2.hot-update.js",
                "app.js.map",
                "app.f9ee3a13182e32a778b2.hot-update.js.map"
            ]
        }
    },
    namedChunkGroups: {
        app: {
            chunks: ['runtime', 'commons', 'libs', 'app'],
            assets: [
                "runtime.js",
                "runtime.js.map",
                'commons.css',
                'commons.js',
                'commons.css.map',
                'commons.js.map',
                'libs.js',
                'libs.js.map',
                {
                    name: 'app.js'
                },
                {
                    name: "app.f9ee3a13182e32a778b2.hot-update.js"
                },
                "app.js.map",
                "app.f9ee3a13182e32a778b2.hot-update.js.map"
            ]
        },
        a: {
            chunks: ['commons', 'default', 'a'],
            assets: [
                {
                    name: 'commons.css'
                },
                'commons.js',
                'commons.css.map',
                'commons.js.map',
                'default.js',
                'default.js.map',
                'a.js',
                'a.js.map',
                'a.css',
                'a.css.map'
            ]
        }
    },
    chunks: [
        {
            "id": "a",
            "rendered": false,
            "initial": false,
            "entry": false,
            "size": 32905,
            "names": [
                "a"
            ],
            "files": [
                'a.js',
                'a.js.map',
                'a.css',
                'a.css.map'
            ],
            "parents": [
                "app",
                "libs",
                "runtime"
            ]
        },
        {
            "id": "app",
            "rendered": true,
            "initial": true,
            "entry": false,
            "size": 1935551,
            "names": [
                "app"
            ],
            "files": [
                "app.js",
                "app.f9ee3a13182e32a778b2.hot-update.js",
                "app.js.map",
                "app.f9ee3a13182e32a778b2.hot-update.js.map"
            ],
            "hash": "085e9062268b5a89639a",
            "siblings": [
                "libs",
                "runtime"
            ],
            "parents": []
        },
        {
            "id": "runtime",
            "rendered": true,
            "initial": true,
            "entry": true,
            "size": 0,
            "names": [
                "runtime"
            ],
            "files": [
                "runtime.js",
                "runtime.js.map"
            ],
            "hash": "920d427e5afcdda9222b",
            "siblings": [
                "app",
                "libs"
            ],
            "parents": []
        },
        {
            "id": "libs",
            "rendered": false,
            "initial": true,
            "entry": false,
            "reason": "split chunk (cache group: libs) (name: libs)",
            "size": 1833271,
            "names": [
                "libs"
            ],
            "files": [
                "libs.js",
                "libs.js.map"
            ],
            "hash": "35a71a4d80f71abe06b6",
            "parents": [
                "app",
                "libs",
                "runtime"
            ]
        }
    ],
    publicPath: '//s.iplay.126.net/t/s/',
    outputPath: path.resolve(__dirname, './css/')
}

export const stats1 = {
    entrypoints: {
        app: {
            chunks: ['commons', 'libs', 'app'],
            assets: [
                'commons.css',
                'commons.js',
                'commons.css.map',
                'commons.js.map',
                'libs.js',
                'libs.js.map',
                'app.js',
                'app.js.map'
            ]
        }
    },
    namedChunkGroups: {
        app: {
            chunks: ['commons', 'libs', 'app'],
            assets: [
                'commons.css',
                'commons.js',
                'commons.css.map',
                'commons.js.map',
                'libs.js',
                'libs.js.map',
                'app.js',
                'app.js.map'
            ]
        },
        a: {
            chunks: ['commons', 'default', 'a'],
            assets: [
                'commons.css',
                'commons.js',
                'commons.css.map',
                'commons.js.map',
                'default.js',
                'default.js.map',
                'a.js',
                'a.js.map',
                'a.css',
                'a.css.map'
            ]
        }
    },
    publicPath: '//s.iplay.126.net/t/s/',
    outputPath: path.resolve(__dirname, './acss/')  // 不存在
}

export const stats2 = {
    entrypoints: {
        app: {
            chunks: ['app'],
            assets: [
                'app.js',
                'app.js.map'
            ]
        }
    },
    namedChunkGroups: {
        app: {
            chunks: ['app'],
            assets: [
                'app.js',
                'app.js.map'
            ]
        },
        b: {
            chunks: ['b'],
            assets: [
                'b.js',
                'b.js.map',
                'b.css',
                'b.css.map'
            ]
        }
    },
    publicPath: '//s.iplay.126.net/t/s/',
    outputPath: path.resolve(__dirname, './css/')
}

export const stats3 = {
    entrypoints: {
        app: {
            chunks: [1, 3 , 2],
            assets: [
                'commons.css',
                'commons.js',
                'commons.css.map',
                'commons.js.map',
                'runtimea.js',
                'runtimea.js.map',
                'app.js',
                'app.js.map'
            ]
        }
    },
    namedChunkGroups: {
        app: {
            chunks: [1, 3, 2],
            assets: [
                'commons.css',
                'commons.js',
                'commons.css.map',
                'commons.js.map',
                'runtimea.js',
                'runtimea.js.map',
                'app.js',
                'app.js.map'
            ]
        },
        a: {
            chunks: [1, 4, 5],
            assets: [
                'commons.css',
                'commons.js',
                'commons.css.map',
                'commons.js.map',
                'default.js',
                'default.js.map',
                'a.js',
                'a.js.map',
                'a.css',
                'a.css.map'
            ]
        }
    },
    publicPath: '//s.iplay.126.net/t/s/',
    outputPath: path.resolve(__dirname, './css/')
}

export const stats4 = {
    chunks: [
        {
            "files": [
                "b.css",
                "b.js"
            ],
            id: 0,
            "parents": [
                2
            ]
        },
        {
            "files": [
                "app.css",
                "app.js"
            ],
            id: 1,
            "parents": []
        },
        {
            "files": [
                "common.css",
                "common.js"
            ],
            id: 2,
            "parents": [1]
        }
    ],
    entrypoints: {
        app: {
            chunks: [1],
            assets: [
                'app.js',
                'app.js.map'
            ]
        }
    },
    namedChunkGroups: {
        app: {
            chunks: [1],
            assets: [
                'app.js',
                'app.js.map'
            ]
        },
        b: {
            chunks: [0],
            assets: [
                'b.js',
                'b.js.map',
                'b.css',
                'b.css.map'
            ]
        }
    },
    publicPath: '//s.iplay.126.net/t/s/',
    outputPath: path.resolve(__dirname, './css/')
}

export const stats5 = {
    remotesMap: {
        "b": [
            {
                "shareScope": "default",
                "name": "./Sign",
                "externalModuleId": "webpack/container/reference/look_common"
            }
        ]
    },
    chunks: [
        {
            "files": [
                "b.css",
                "b.js"
            ],
            id: 0,
            "parents": [
                2
            ]
        },
        {
            "files": [
                "app.css",
                "app.js"
            ],
            id: 1,
            "parents": []
        },
        {
            "files": [
                "commons.css",
                "common.js"
            ],
            id: 2,
            "parents": [1]
        }
    ],
    entrypoints: {
        app: {
            chunks: [1],
            assets: [
                'app.js',
                'app.js.map'
            ]
        }
    },
    namedChunkGroups: {
        app: {
            chunks: [1],
            assets: [
                'app.js',
                'app.js.map'
            ]
        },
        b: {
            chunks: [0],
            assets: [
                'b.js',
                'b.js.map',
                'b.css',
                'b.css.map'
            ]
        }
    },
    publicPath: '//s.iplay.126.net/t/s/',
    outputPath: path.resolve(__dirname, './css/')
}

export const extraStats = {
    publicPath: '//s2.iplay.126.net/livemobile/s/',
    exposesMap: {
        "./Sign": [
            1
        ]
    },
    chunks: [
        {
            "files": [
                "b.css",
                "b.js"
            ],
            id: 0,
            "parents": [
                2
            ]
        },
        {
            "files": [
                "actdetail.f2b9cd10.css", // look h5 的线上 cdn 地址
                "sign.js"
            ],
            id: 1
        }
    ]
}
