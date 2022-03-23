import { Component } from 'vue'

export interface IComponent {
  is: Component;
  attrs?: Record<string, unknown>;
}

export { default as DynamicComponent } from './DynamicComponent.vue'
