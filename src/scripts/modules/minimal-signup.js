import queryString from 'query-string'

var serialize = function (form) {

  // Setup our serialized data
  var serialized = [];

  // Loop through each field in the form
  for (var i = 0; i < form.elements.length; i++) {

    var field = form.elements[i];

    // Don't serialize fields without a name, submits, buttons, file and reset inputs, and disabled fields
    if (!field.name || field.disabled || field.type === 'file' || field.type === 'reset' || field.type === 'submit' || field.type === 'button') continue;

    // If a multi-select, get all selections
    if (field.type === 'select-multiple') {
      for (var n = 0; n < field.options.length; n++) {
        if (!field.options[n].selected) continue;
        serialized.push(encodeURIComponent(field.name) + "=" + encodeURIComponent(field.options[n].value));
      }
    }

    // Convert field data to a query string
    else if ((field.type !== 'checkbox' && field.type !== 'radio') || field.checked) {
      serialized.push(encodeURIComponent(field.name) + "=" + encodeURIComponent(field.value));
    }
  }

  return serialized.join('&');

};

export default class MinimalSignup {
  constructor(el) {
    this.wrapper = el;
    this.form = el.querySelector('form');
    this.input = this.form.querySelector('input[type=email]');

    this.formSubmit= this.formSubmit.bind(this);
    this.finishForm= this.finishForm.bind(this);
    this.getFormResponse= this.getFormResponse.bind(this);

    var parsedURL = queryString.parse(location.search);

    if (parsedURL.customer_posted == true || parsedURL.customer_posted == 'true') {

      this.finishForm();
    } else{
      this.form.addEventListener('submit', this.formSubmit, true);

      if (parsedURL.form_type == 'customer') {
        this.form.classList.add('error');

      }
    }

  }
  formSubmit(event) {
    var data = serialize(this.form);
    this.wrapper.classList.add('processing');
    var response = this.getFormResponse(data).then(response=> {
      this.wrapper.classList.remove('processing');
      if (response.status == '200') {
        if (response.redirected == true) {

          // window.location = response.url + '?' + data
        }
      }
      else {
        event.preventDefault();
        if (response.ok == false) {
          this.wrapper.classList.add('error');
        }
        if (response.ok == true) {
          this.wrapper.classList.add('success');
        }
      }
    }).catch(console.error(error));
  }
  async getFormResponse(data) {
    const url = '/contact#contact_form?'+ data;
    const response = await fetch(url,
      {
        method: 'POST'
      });
    var responseJson = await response;
    return await responseJson;
  }
  finishForm() {
    this.wrapper.classList.add('success');
    const successText = this.input.getAttribute('data-success-text');
    console.log(successText);
    this.input.setAttribute('disabled', 'disabled');
    this.input.value = successText;
    this.form.removeEventListener('submit', this.formSubmit, true)
    this.form.onsubmit=function(event) {
      event.preventDefault;
      return false;
    }
  }
}