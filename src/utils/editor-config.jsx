import { ElButton, ElInput } from 'element-plus'

function createEditorConfig() {
  const componentList = []
  const componentMap = {}


  return {
    componentList,
    componentMap,
    register: (component) => {
      componentList.push(component)
      componentMap[component.key] = component
    }
  }
}

export const registerConfig = createEditorConfig();

registerConfig.register({
  label: '文本',
  preview: () => '预览文本',
  render: () => '渲染文本',
  key: 'text'
})

registerConfig.register({
  label: '按钮',
  key: 'button',
  resize: {
    width: true,
    height: true
  },
  preview: () => <ElButton>预览按钮</ElButton>,
  render: ({ props, size }) => <ElButton style={{ height: size.height + 'px', width: size.width + 'px' }} type={props.type} size={props.size}>{props.text || '渲染按钮'}</ElButton>,
  props: {
  },
})

registerConfig.register({
  label: '输入框',
  preview: () => <ElInput placeholder="预览输入框"></ElInput>,
  render: () => <ElInput placeholder="预览输入框"></ElInput>,
  key: 'input'
})