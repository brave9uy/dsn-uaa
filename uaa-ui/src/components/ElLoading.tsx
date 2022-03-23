import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    backgroundColor: {
      type: String,
      default: 'rgba(0, 0, 0, 0.7)'
    },
    zIndex: {
      type: Number,
      default: 2009
    },
    text: {
      type: String,
      default: 'Loading'
    }
  },
  setup(props) {
    return (
      <div
        class="el-loading-mask is-fullscreen"
        style={`background-color: ${props.backgroundColor}; z-index: ${props.zIndex}`}
      >
        <div class="el-loading-spinner">
          <svg class="circular" viewBox="25 25 50 50">
            <circle class="path" cx="50" cy="50" r="20" fill="none"></circle>
          </svg>
          <p class="el-loading-text">{ props.text }</p>
        </div>
      </div>
    )
  }
})
