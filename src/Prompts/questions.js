/*!
 * nlbot
 *
 * @author      Raphael Marco
 * @link        http://pinodex.github.io
 * @license     MIT
 */

module.exports = {
  'ask_class': [
    {
      name: 'classNumber',
      description: 'Enter class number',
      required: true,
      message: 'Invalid class number'
    },
    {
      name: 'confirm',
      description: 'Automate lesson browing in this class? [y/N]',
      required: true,
      message: 'Invalid response'
    }
  ],

  'confirm_browse': [
    {
      name: 'confirm',
      description: 'Proceed? [y/N]',
      required: true,
      message: 'Invalid response'
    }
  ],

  'login': [
    {
      name: 'host',
      description: 'Host/URL',
      required: true
    },
    {
      name: 'userid',
      description: 'User ID',
      required: true
    },
    {
      name: 'password',
      description: 'Password (typing will not be visible)',
      hidden: true,
      required: true,
      message: 'Invalid password input'
    }
  ],

  'try_another': [
    {
      name: 'confirm',
      description: 'The process is complete. Would you like to choose another class? [y/N]',
      required: true,
      message: 'Invalid response'
    }
  ]
};