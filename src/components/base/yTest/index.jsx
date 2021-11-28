import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'
import { key } from '@/store/index'

export default defineComponent({
  name: 'y-test',
  setup(props, { slots }) {
    const store = useStore(key)
    const num = computed(() => store.state.count)

    const add = () => {
      store.dispatch('addCount', 10)
    }
    return () => (
      <div>
        <span>y-test = {num.value}</span>
        <ElButton type="primary" onclick={add}>累加</ElButton>
        <div>
          {slots.default()}
        </div>
      </div>
    )
  }
})
