import {Entity} from './entity.js'
import {Factory} from './factory.js'
import {Symbol} from './symbol.js'

export let EntityFactory = new Factory(Entity, 'entities');

EntityFactory.learn({
  'name': 'avatar',
  'symbol': new Symbol('@','#dd4'),
  'mixinNames': ["TimeTracker"]
});
