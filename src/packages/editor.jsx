import { defineComponent, computed, inject, ref } from 'vue'
import deepcopy from 'deepcopy'

import EditorBlock from './editor-block'
import { useMenuDragger } from './useMenuDragger'
import { useBlockDragger } from './useBlockDragger'
import { useFocus } from './useFocus'

import './editor.scss'

export default defineComponent({
  props: {
    modelValue: { type: Object }
  },
  setup(props, ctx) {
    const previewRef = ref(false);
    const editorRef = ref(true);

    const data = computed({
      get() {
        return props.modelValue
      },
      set(newValue) {
        ctx.emit('update:modelValue', deepcopy(newValue))
      }
    })

    const containerStyles = computed(() => ({
      width: data.value.container.width + 'px',
      height: data.value.container.height + 'px'
    }))

    const config = inject('config')

    const containerRef = ref(null);

    // 菜单的拖拽功能
    const { dragstart, dragend } = useMenuDragger(containerRef, data);

    // 1.组件聚焦 然后才能拓转
    let { blockMousedown, focusData, containerMousedown, lastSelectBlock, clearBlockFocus } = useFocus(data, previewRef, (e) => {
      // 获取焦点后进行拖拽
      mousedown(e)
    });
    // 2.组件拖拽
    let { mousedown, markLine } = useBlockDragger(focusData, lastSelectBlock, data);

    return () => <div className="editor">
      <div className="editor-left">
        {
          config.componentList.map(component => (
            <div className="editor-left-item"
              draggable
              onDragstart={e => dragstart(e, component)}
              onDragend={dragend}
            >
              <span>{component.label}</span>
              <div>{component.preview()}</div>
            </div>
          ))
        }

      </div>
      <div className="editor-top">菜单栏</div>
      <div className="editor-right">属性控制栏目</div>
      <div className="editor-container">
        {/* 负责产生滚动条 */}
        <div className="editor-container-canvas">
          {/* 产生内容区域 */}
          <div className="editor-container-canvas__content"
            ref={containerRef}
            style={containerStyles.value}
            onMousedown={containerMousedown}
          >
            {
              (data.value.blocks.map((block, index) => (
                <EditorBlock key={index} block={block}
                  className={block.focus ? 'editor-block-focus editor-block' : 'editor-block'}
                  onMousedown={(e) => blockMousedown(e, block, index)}
                />
              )))
            }

            {markLine.x !== null && <div class="line-x" style={{ left: markLine.x + 'px' }}></div>}
            {markLine.y !== null && <div class="line-y" style={{ top: markLine.y + 'px' }}></div>}

          </div>
        </div>
      </div>
    </div>
  }
})