extends ../layout

block content
  .row
    .large-12.columns
      h2= title
  .row
    .large-12.columns
      form.custom(name='user[authorise]', action='/users', method='post')
        .row
          .large-12.columns
            label Username
              input(name='user[username]', type='text', placeholder='username', value=user.username)
        .row
          .large-12.columns
            label email
              input(name='user[email]', type='email', placeholder='email', value=user.email)
        .row
          .large-12.columns
            label Name
              input(name='user[name]', type='text', placeholder='name', value=user.name)
        .row
          .large-12.columns
            label Password
              input(name='user[password]', type='password', placeholder='password')
        .row
          .large-12.columns
            label Confirm Password
              input(name='user[passwordConfirmation]', type='password', placeholder='confirm password')
        .row
          .large-12.columns
            button(type='submit') authorise
