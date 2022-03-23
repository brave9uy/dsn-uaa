import { ElMessage, MessageHandle } from 'element-plus'

interface IMessageProps {
  message: string;
  duration: number;
  showClose: boolean;
}

const DURATION = 2000
const SHOW_CLOSE = true

const initMsgOpt = (opstions: Partial<IMessageProps> | string): Partial<IMessageProps> => {
  if (typeof opstions === 'string') {
    return {
      message: opstions,
      duration: DURATION,
      showClose: SHOW_CLOSE
    }
  } else {
    return Object.assign({
      duration: DURATION,
      showClose: SHOW_CLOSE
    }, opstions)
  }
}

const Message = {
  success: (opstions: Partial<IMessageProps> | string): MessageHandle => {
    return ElMessage.success(initMsgOpt(opstions))
  },
  error: (opstions: Partial<IMessageProps> | string): MessageHandle => {
    return ElMessage.error(initMsgOpt(opstions))
  },
  warning: (opstions: Partial<IMessageProps> | string): MessageHandle => {
    return ElMessage.warning(initMsgOpt(opstions))
  }
}

export default Message
