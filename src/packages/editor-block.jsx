import { defineComponent, computed, inject } from "vue";

export default defineComponent({
  props: {
    block: { type: Object }
  },
  setup(props) {

    const blockStyles = computed(() => ({
      top: `${props.block.top}px`,
      left: `${props.block.left}px`,
      zIndex: `${props.block.zIndex}px`,
    }))

    const config = inject('config')
    console.log(config);
    return () => {
      const component = config.componentMap[props.block.key];
      const RenderComponent = component.render()
      return <div className="editor-block" style={blockStyles.value}>
        {RenderComponent}
      </div>
    }
  }
})