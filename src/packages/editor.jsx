import { defineComponent, computed, inject } from 'vue'
import './editor.scss'
import EditorBlock from './editor-block'
export default defineComponent({
  props: {
    modelValue: { type: Object }
  },
  setup(props) {
    const data = computed({
      get() {
        return props.modelValue
      }
    })

    const containerStyles = computed(() => ({
      with: data.value.container.width + 'px',
      height: data.value.container.height + 'px'
    }))

    const config = inject('config')

    return () => <div className="editor">
      <div className="editor-left">
        {
          config.componentList.map(compoent => (
            <div className="editor-left-item">
              <span>{compoent.label}</span>
              <div>{compoent.preview()}</div>
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
          <div className="editor-container-canvas__content" style={containerStyles.value}>
            {
              (data.value.blocks.map((block, index) => (
                <EditorBlock key={index} block={block} />
              )))
            }
          </div>
        </div>
      </div>
    </div>
  }
})