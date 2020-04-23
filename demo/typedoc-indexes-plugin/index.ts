/**
 * @File   : index.ts
 * @Author : 瞬光 (shunguang.dty@antfin.com)
 * @Date   : 1/30/2019, 11:59:13 AM
 * @Description:
 */
import {Application} from 'typedoc/dist/lib/application';
import * as path from 'path';
import * as fs from 'fs';
import {Component, ConverterComponent} from 'typedoc/dist/lib/converter/components';
import {RendererEvent} from 'typedoc/dist/lib/output/events';

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

@Component({ name: 'indexes' })
class IndexesPlugin extends ConverterComponent {
  // listen to event on initialisation
  public initialize() {
    this.listenTo(this.application.renderer, {
      [RendererEvent.END]: this.onRenderEnd
    });
  }

  private onRenderEnd(event: RendererEvent) {
    const readme = fs.readFileSync(`${event.outputDirectory}/README.md`, {encoding: 'utf8'});
    const result = {} as any;
    result.Extensions = [];

    regPatterns.forEach(({reg, folder}) => {
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

        let regLineStr: string;

        if (folder) {
          // regLineStr = `^\\* \\[(.+)\\]\\(${folder}/(.+)\\)`;
          regLineStr = `^\\* \\[(.+)\\]\\((.+)\\)`;
        } else {
          regLineStr = `^\\* \\[(.+)\\]\\((.+)\\)`;
        }

        const r = new RegExp(regLineStr);
        const lineR = r.exec(line);

        if (!lineR) {
          return;
        }

        const [_, name, url] = lineR;

        if (folder) {
          result[category].push({name, route: url.replace('.md', ''), url});
        } else {
          result[category].push({name, route: 'main' + url, url: 'README.md'});
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
}

module.exports = (PluginHost: Application) => {
  const app = PluginHost.owner;

  if (app.converter.hasComponent('indexes')) {
    return;
  }
  /**
   * Add the plugin to the converter instance
   */
  app.converter.addComponent('indexes', new IndexesPlugin(app.converter));
};
