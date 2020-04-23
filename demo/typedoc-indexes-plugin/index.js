"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
const components_1 = require("typedoc/dist/lib/converter/components");
const events_1 = require("typedoc/dist/lib/output/events");
const regPatterns = [
    {
        folder: 'modules',
        reg: /### (Modules)([\s\S]+?)\n(### |---)/g
    },
    {
        folder: 'classes',
        reg: /### (Classes)([\s\S]+?)\n(### |---)/g
    },
    {
        folder: 'interfaces',
        reg: /### (Interfaces)([\s\S]+?)\n(### |---)/g
    },
    {
        reg: /### (Functions)([\s\S]+?)\n(### |---)/g
    },
    {
        folder: 'enums',
        reg: /### (Enums)([\s\S]+?)\n(### |---)/g
    },
    {
        reg: /### (Variables)([\s\S]+?)\n(### |---?)/g
    },
    {
        reg: /### (Type aliases)([\s\S]+?)\n(### |---?)/g
    },
    {
        reg: /### (Object literals)([\s\S]+?)\n(### |---)/g
    }
];
let IndexesPlugin = class IndexesPlugin extends components_1.ConverterComponent {
    // listen to event on initialisation
    initialize() {
        this.listenTo(this.application.renderer, {
            [events_1.RendererEvent.END]: this.onRenderEnd
        });
    }
    onRenderEnd(event) {
        const readme = fs.readFileSync(`${event.outputDirectory}/README.md`, { encoding: 'utf8' });
        const result = {};
        result.Extensions = [];
        regPatterns.forEach(({ reg, folder }) => {
            const text = reg.exec(readme);
            if (!text) {
                return;
            }
            const [_, category, content] = text;
            result[category] = result[category] || [];
            content.split('\n').forEach(line => {
                if (!line) {
                    return;
                }
                let regLineStr;
                if (folder) {
                    // regLineStr = `^\\* \\[(.+)\\]\\(${folder}/(.+)\\)`;
                    regLineStr = `^\\* \\[(.+)\\]\\((.+)\\)`;
                }
                else {
                    regLineStr = `^\\* \\[(.+)\\]\\((.+)\\)`;
                }
                const r = new RegExp(regLineStr);
                const lineR = r.exec(line);
                if (!lineR) {
                    return;
                }
                const [_, name, url] = lineR;
                if (folder) {
                    result[category].push({ name, route: url.replace('.md', ''), url });
                }
                else {
                    result[category].push({ name, route: 'main' + url, url: 'README.md' });
                }
            });
        });
        delete result['Modules'];
        // todo: extensions
        // const modulesMd = fs.readFileSync(`${event.outputDirectory}/modules/_seinjs_.md`, {encoding: 'utf8'});
        // const [_, __, content] = /### (Modules)([\s\S]+?)\n(### |---)/g.exec(modulesMd);
        // content.split('\n').forEach(line => {
        //   if (!line) {
        //     return;
        //   }
        //   const r = new RegExp(`^\\* \\[(.+)\\]\\((.+)\\)`);
        //   const lineR = r.exec(line);
        //   if (!lineR) {
        //     return;
        //   }
        //   const [_, name, url] = lineR;
        //   result.Extensions.push({name, route: 'extensions/' + url.split('.')[1], url: 'modules/' + url});
        // });
        const tsPath = path.resolve(__dirname, '../pages/document/config.ts');
        const res = '/*tslint:disable */\nexport default ' + JSON.stringify(result, null, 2) + '\n/*tslint:enable */\n';
        fs.writeFileSync(tsPath, res);
    }
};
IndexesPlugin = __decorate([
    components_1.Component({ name: 'indexes' })
], IndexesPlugin);
module.exports = (PluginHost) => {
    const app = PluginHost.owner;
    if (app.converter.hasComponent('indexes')) {
        return;
    }
    /**
     * Add the plugin to the converter instance
     */
    app.converter.addComponent('indexes', new IndexesPlugin(app.converter));
};
