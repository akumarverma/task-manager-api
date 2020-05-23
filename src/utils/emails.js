const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SGMAIL_API_KEY);

const accountSetup = async (email, name) =>{
  await sgMail.send({
    to: email,
    from: 'amit-verma@hotmail.com',
    Subject: `Welcome ${name}, Thanks for joining in!`,
    text: `Welcome to the App. Let us manage your important tasks.`
  })
}

const accountCancellation = async (email, name) =>{
  await sgMail.send({
    to: email,
    from: 'amit-verma@hotmail.com',
    Subject: `Bye ${name}, See you again!`,
    text: `We are sorry that you decided to leave us. Hope to see you joining back.`
  })
}

module.exports ={
  accountSetup,
  accountCancellation
}