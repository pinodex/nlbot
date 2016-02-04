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
      description: 'Enter class number'
    },
    {
      name: 'confirm',
      description: 'Automate lesson browing in this class? [y/N]'
    }
  ],

  'confirm_browse': [
    {
      name: 'confirm',
      description: 'Proceed? [y/N]'
    }
  ],

  'login': [
    {
      name: 'host',
      description: 'Host/URL'
    },
    {
      name: 'userid',
      description: 'User ID'
    },
    {
      name: 'password',
      description: 'Password (typing will not be visible)',
      hidden: true
    }
  ],

  'try_another': [
    {
      name: 'confirm',
      description: 'The process is complete. Would you like to choose another class? [y/N]'
    }
  ]
};