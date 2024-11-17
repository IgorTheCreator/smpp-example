const smpp = require('smpp')
require('dotenv').config()

const config = {
  login: process.env.login,
  password: process.env.password,
  url: process.env.url,
  phone_number: process.env.phone_number,
  message: 'Сообщение от Node.js для Лучшего Студента ЮРГПУ(НПИ) им. М. Ю. Платова',
}

function connect() {
  session.bind_transceiver(
    {
      system_id: config.login,
      password: config.password,
    },
    bind_transceiver
  )
}

function bind_transceiver(pdu) {
  if (pdu.command_status === 0) {
    session.submit_sm(
      {
        destination_addr: config.phone_number,
        short_message: config.message,
      },
      submit_sm
    )
  }
}

function submit_sm(pdu) {
  if (pdu.command_status === 0) {
    console.log('Сообщение успешно отправлено!')
    session.emit('close')
  }
}

const session = smpp.connect(
  {
    url: config.url,
  },
  connect
)

session.on('close', () => {
  console.log('Соединение закрыто')
  process.exit(1)
})
session.on('error', err => console.log(`Ошибка: ${err.message}`))