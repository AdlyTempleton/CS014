import * as M from './entity_mixins.js'

export class Mixable {

  constructor(template){
    if(!this.state){
      this.state = {};

      this.name = template.name || ' ';
      this.templateName = template.templateName ? template.templateName : this.name;

      this.mixins = [];
      this.mixinTracker = {};

      if(template.mixingNames){
        for( let mi=0; mi < template.mixinNames.length; mi++){
          this.mixins.push(E[template.mixinNames[mi]]);
          this.mixinTracker[template.mixinNames[mi]] = true;


        }
      }

      for( let mi=0; mi < this.mixins.length; mi++){
          this.state[m.META.mixinName] = {};

          for(let sbase in m.META.stateModel){
            this.state[m.META.mixinName][sbase] = m.META.stateModel[sbase];
          }

          for(let m in m.META.methods){
            this[m] = m.META.methods[m];
          }
      }
  }

}
