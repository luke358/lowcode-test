import { defineComponent, computed, inject, ref, onMounted } from "vue";
import BlockResize from "./block-resize";

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

    const blockRef = ref(null)
    onMounted(() => {
      let { offsetWidth, offsetHeight } = blockRef.value;
      if (props.block.alignCenter) { // 说明是拖拽松手的时候才渲染的，其他的默认渲染到页面上的内容不需要居中
        props.block.left = props.block.left - offsetWidth / 2;
        props.block.top = props.block.top - offsetHeight / 2; // 原则上重新派发事件
        props.block.alignCenter = false; // 让渲染后的结果才能去居中
      }
      props.block.width = offsetWidth;
      props.block.height = offsetHeight;
    })
    return () => {

      const component = config.componentMap[props.block.key];

      const RenderComponent = component.render({
        size: props.block.hasResize ? { width: props.block.width, height: props.block.height } : {},
        props: props.block.props,
        model: Object.keys(component.model || {}).reduce((prev, modelName) => {
          let propName = props.block.model[modelName]; // 'username'
          prev[modelName] = {
            modelValue: props.formData[propName], // zfjg
            "onUpdate:modelValue": v => props.formData[propName] = v
          }
          return prev;
        }, {})
      })

      const { width, height } = component.resize || {}

      return <div className="editor-block" style={blockStyles.value} ref={blockRef}>
        {RenderComponent}
        {/* 传递block的目的是为了修改当前block的宽高， component中存放了是修改高度还是宽度 */}
        {props.block.focus && (width || height) && <BlockResize
          block={props.block}
          component={component}
        ></BlockResize>}
      </div>
    }
  }
})