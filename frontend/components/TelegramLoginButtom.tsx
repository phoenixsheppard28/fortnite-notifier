import { useEffect } from 'react'

const TelegramLoginButton = () => {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://telegram.org/js/telegram-widget.js?22'
    script.async = true
    script.setAttribute('data-telegram-login', 'fortniteshopskinbot') // name must be the @ not the view name
    script.setAttribute('data-size', 'large')
    script.setAttribute(
      'data-auth-url',
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/telegram`,
    )
    script.setAttribute('data-request-access', 'write')
    script.setAttribute('data-userpic', 'false')
    script.setAttribute('data-radius', '8')

    const container = document.getElementById('telegram-button-container')
    if (container && container.childNodes.length === 0) {
      container.appendChild(script)
    }
  }, [])

  return <div className="flex justify-center" id="telegram-button-container" />
}

export default TelegramLoginButton
