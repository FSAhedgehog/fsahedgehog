import React, {Component} from 'react'
import axios from 'axios'
// import mailchimp from '@mailchimp/mailchimp_marketing'

// mailchimp.setConfig({
//   apiKey: process.env.MAIL_CHIMP,
//   server: 'us1',
// })

// async function run() {
//   const response = await mailchimp.ping.get()
//   console.log(response)
// }

export class EmailSub extends React.Component {
  constructor() {
    super()
    this.state = {
      email: '',
      userSubmit: false,
      pastEmail: '',
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  // componentDidMount() {
  //   run()
  // }

  handleChange(event) {
    this.setState({email: event.target.value})
  }

  handleSubmit(event) {
    setTimeout(() => {
      let response = document.querySelectorAll('#templateBody')[0].childNodes[3]
        .childNodes[0].innerText
      console.log(response)
      if (response) {
        this.setState((prevState) => ({
          email: '',
          userSubmit: true,
          pastEmail: prevState.email,
        }))
      } else {
        console.log(response)
        document.getElementsByClassName(
          'email'
        )[0].placeholder = `${this.state.email} is already subscribed`
        this.setState({email: ''})
      }
    }, 1)
  }

  render() {
    return (
      <div>
        {this.state.userSubmit ? (
          <div>
            <h1>{this.state.pastEmail} has been subscribed!</h1>
          </div>
        ) : (
          <div id="mc_embed_signup">
            <form
              action="https://herokuapp.us1.list-manage.com/subscribe/post?u=c80e36c028789dfbc4a81d317&amp;id=fe6b48211a"
              method="post"
              id="mc-embedded-subscribe-form"
              name="mc-embedded-subscribe-form"
              className="validate"
              target="hiddenFrame"
              noValidate
              onSubmit={this.handleSubmit}
            >
              <div id="mc_embed_signup_scroll">
                <label htmlFor="mce-EMAIL">Subscribe</label>
                <input
                  type="email"
                  value={this.state.email}
                  name="EMAIL"
                  className="email"
                  id="mce-EMAIL"
                  placeholder="email address"
                  required
                  // display="none"
                  onChange={this.handleChange}
                />
                {/* <div aria-hidden="true">
              <input
                type="text"
                name="b_c80e36c028789dfbc4a81d317_fe6b48211a"
                tabIndex="-1"
                value=""
              />
            </div> */}
                <div>
                  <input
                    type="submit"
                    defaultValue="Subscribe"
                    name="subscribe"
                    id="mc-embedded-subscribe"
                    className="button"
                  />
                </div>
              </div>
            </form>
          </div>
        )}
        <iframe
          src="https://herokuapp.us1.list-manage.com/subscribe/post?u=c80e36c028789dfbc4a81d317&amp;id=fe6b48211a"
          // display="none"
          id="emailIFrame"
          name="hiddenFrame"
        ></iframe>
      </div>
    )
  }
}

export default EmailSub

async function postEmail(email) {
  try {
    let config = {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    }
    const response = await axios.post(
      'https://herokuapp.us1.list-manage.com/subscribe/post?u=c80e36c028789dfbc4a81d317&amp;id=fe6b48211a',
      {
        email: email,
      },
      config
    )
    console.log(response)
  } catch (error) {
    console.log(error)
  }
}

// const listId = 'YOUR_LIST_ID'
// const subscribingUser = {
//   firstName: 'Prudence',
//   lastName: 'McVankab',
//   email: 'prudence.mcvankab@example.com',
// }

// async function run() {
//   const response = await mailchimp.lists.addListMember(listId, {
//     email_address: subscribingUser.email,
//     status: 'subscribed',
//     merge_fields: {
//       FNAME: subscribingUser.firstName,
//       LNAME: subscribingUser.lastName,
//     },
//   })

//   console.log(
//     `Successfully added contact as an audience member. The contact's id is ${response.id}.`
//   )
// }

// run()

/// grabs the iframe info
// document.querySelectorAll('#templateBody')[0].childNodes[3].childNodes[0]
//   .innerText
