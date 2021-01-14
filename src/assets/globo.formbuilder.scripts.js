{{ 'globo.formbuilder.css' | asset_url | stylesheet_tag }}<script>
	var Globo = Globo || {};
    Globo.FormBuilder = Globo.FormBuilder || {}
    Globo.FormBuilder.url = "https://form.globosoftware.net"
    Globo.FormBuilder.shop = {
        settings : {
            reCaptcha : {
                siteKey : ''
            }
        },
        pricing:{
            features:{
                fileUpload : 2,
                removeCopyright : false
            }
        }
    }
    Globo.FormBuilder.forms = []

    {% if customer %}        Globo.FormBuilder.customer = {
            id : '{{ customer.id }}',
            name : '{{ customer.name }}',
            email : '{{ customer.email }}'
        }
    {% endif %}    Globo.FormBuilder.page = {
        title : document.title,
        href : window.location.href
    }
</script>

<script type="text/template" id="globo-formbuilder-dynamicCSS">
{% raw %}
	.globo-form-app{
    max-width: {{configs.appearance.width}}px;
    width: -webkit-fill-available;
    background-color:#FFF;
    {% if configs.appearance.background == 'color' %}
    background-color: {{configs.appearance.backgroundColor}};
    {% endif %}
    {% if configs.appearance.background == 'image' %}
    background-image : url('{{configs.appearance.backgroundImage}}');
    background-position: center {{configs.appearance.backgroundImageAlignment}};;
    background-repeat:no-repeat;
    background-size: cover;
    {% endif %}
}

.globo-form-app .globo-heading{
    color: {{configs.appearance.headingColor}}
}
.globo-form-app .globo-description,
.globo-form-app .header .globo-description{
    color: {{configs.appearance.descriptionColor}}
}
.globo-form-app .globo-label,
.globo-form-app .globo-form-control label.globo-label{
    color: {{configs.appearance.labelColor}}
}
.globo-form-app .globo-form-control .help-text.globo-description{
    color: {{configs.appearance.descriptionColor}}
}
.globo-form-app .globo-form-control .checkbox-wrapper .globo-option,
.globo-form-app .globo-form-control .radio-wrapper .globo-option
{
    color: {{configs.appearance.optionColor}}
}
.globo-form-app .footer{
    text-align:{{configs.footer.submitAlignment}};
}
.globo-form-app .footer button{
    border:1px solid {{configs.appearance.mainColor}};
    {% if configs.footer.submitFullWidth %}
        width:100%;
    {% endif %}
}
.globo-form-app .footer button.submit,
.globo-form-app .footer button.action.loading .spinner{
    background-color: {{configs.appearance.mainColor}};
    color : {{ configs.appearance.mainColor | idealTextColor }};
}
.globo-form-app .globo-form-control .star-rating>fieldset:not(:checked)>label:before {
    content: url('data:image/svg+xml; utf8, <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="star" class="svg-inline--fa fa-star fa-w-18" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="{{configs.appearance.mainColor | encodeHexColor }}" d="M528.1 171.5L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6zM388.6 312.3l23.7 138.4L288 385.4l-124.3 65.3 23.7-138.4-100.6-98 139-20.2 62.2-126 62.2 126 139 20.2-100.6 98z"></path></svg>');
}
.globo-form-app .globo-form-control .star-rating>fieldset>input:checked ~ label:before {
    content: url('data:image/svg+xml; utf8, <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="star" class="svg-inline--fa fa-star fa-w-18" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="{{configs.appearance.mainColor | encodeHexColor }}" d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"></path></svg>');
}
.globo-form-app .globo-form-control .star-rating>fieldset:not(:checked)>label:hover:before, .globo-form-app .globo-form-control .star-rating>fieldset:not(:checked)>label:hover ~ label:before{
    content : url('data:image/svg+xml; utf8, <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="star" class="svg-inline--fa fa-star fa-w-18" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="{{configs.appearance.mainColor | encodeHexColor }}" d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"></path></svg>')
}
.globo-form-app .globo-form-control .radio-wrapper .radio-input:checked ~ .radio-label:after {
    background: {{configs.appearance.mainColor}};
    background: radial-gradient({{configs.appearance.mainColor}} 40%, #fff 45%);
}
.globo-form-app .globo-form-control .checkbox-wrapper .checkbox-input:checked ~ .checkbox-label:before {
    border-color: {{configs.appearance.mainColor}};
    box-shadow: 0 4px 6px rgba(50,50,93,0.11), 0 1px 3px rgba(0,0,0,0.08);
    background-color: {{configs.appearance.mainColor}};
}
.globo-form-app .step.-completed .step__number,
.globo-form-app .line.-progress,
.globo-form-app .line.-start{
    background-color: {{configs.appearance.mainColor}};
}
.globo-form-app .checkmark__check,
.globo-form-app .checkmark__circle{
    stroke: {{configs.appearance.mainColor}};
}
.globo-form .floating-button{
    background-color: {{configs.appearance.mainColor}};
}
.globo-form-app .globo-form-control .checkbox-wrapper .checkbox-input ~ .checkbox-label:before,
.globo-form-app .globo-form-control .radio-wrapper .radio-input ~ .radio-label:after{
    border-color : {{configs.appearance.mainColor}};
}
.flatpickr-day.selected, .flatpickr-day.startRange, .flatpickr-day.endRange, .flatpickr-day.selected.inRange, .flatpickr-day.startRange.inRange, .flatpickr-day.endRange.inRange, .flatpickr-day.selected:focus, .flatpickr-day.startRange:focus, .flatpickr-day.endRange:focus, .flatpickr-day.selected:hover, .flatpickr-day.startRange:hover, .flatpickr-day.endRange:hover, .flatpickr-day.selected.prevMonthDay, .flatpickr-day.startRange.prevMonthDay, .flatpickr-day.endRange.prevMonthDay, .flatpickr-day.selected.nextMonthDay, .flatpickr-day.startRange.nextMonthDay, .flatpickr-day.endRange.nextMonthDay {
    background: {{configs.appearance.mainColor}};
    border-color: {{configs.appearance.mainColor}};
}
{% endraw %}
</script>
<script type="text/template" id="globo-formbuilder-template">
{% raw %}
	<div class="globo-form {{configs.appearance.layout}}-form">
<style>{{ null | renderElement : dynamicCSS,configs }}</style>
<div class="globo-form-app {{configs.appearance.layout}}-layout">
    <form class="g-container" novalidate action="{{Globo.FormBuilder.url}}/api/front/form/{{formId}}/send" method="POST" enctype="multipart/form-data" data-id={{formId}}>
        {% if configs.header.active %}
        <div class="header">
            <h3 class="title globo-heading">{{configs.header.title}}</h3>
            {% if configs.header.description != '' and configs.header.description != '<p><br></p>' %}
            <div class="description globo-description">{{configs.header.description}}</div>
            {% endif %}
        </div>
        {% endif %}
        {% if configs.isStepByStepForm %}
            <div class="globo-formbuilder-wizard" data-id={{formId}}>
                <div class="wizard__content">
                    <header class="wizard__header">
                        <div class="wizard__steps">
                        <nav class="steps">
                            {% for element in configs.elements %}
                                <div class="step">
                                    <div class="step__content">
                                        <p class="step__number"></p>
                                        <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                                            <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
                                            <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                                        </svg>
                                        <div class="lines">
                                            {% if forloop.first == true %}
                                                <div class="line -start"></div>
                                            {% endif %}
                                            <div class="line -background">
                                            </div>
                                            <div class="line -progress">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            {% endfor %}
                        </nav>
                        </div>
                    </header>
                    <div class="panels">
                        {% for element in configs.elements %}
                        <div class="panel" data-id={{formId}}>
                            {% if element.type != "group" %}
                                {{ element | renderElement : partialElement , configs }}
                            {% else %}
                                {% for el in element.elements %}
                                    {{ el | renderElement : partialElement , configs }}
                                {% endfor %}
                            {% endif %}
                            {% if forloop.last == true %}
                                {% if configs.reCaptcha.enable = true %}
                                    <div class="globo-form-control">
                                        <div class="globo-g-recaptcha" data-sitekey="{{Globo.FormBuilder.shop.settings.reCaptcha.siteKey}}"></div>
                                        <input type="hidden" name="reCaptcha" id="reCaptcha">
                                        <small class="messages"></small>
                                    </div>
                                {% endif %}
                            {% endif %}
                        </div>
                        {% endfor %}
                    </div>
                    {% if Globo.FormBuilder.shop.pricing.features.removeCopyright == false %}
                    <p style="text-align: right;font-size:small;">Made by <a target="_blank" rel="nofollow" href="https://apps.shopify.com/form-builder-contact-form">Powerful Contact Form Builder</a> </p>
                    {% endif %}
                    <div class="message error">
                        <div class="content"></div>
                        <div class="dismiss" onclick="Globo.dismiss(this)">
                            <svg viewBox="0 0 20 20" class="" focusable="false" aria-hidden="true"><path d="M11.414 10l4.293-4.293a.999.999 0 1 0-1.414-1.414L10 8.586 5.707 4.293a.999.999 0 1 0-1.414 1.414L8.586 10l-4.293 4.293a.999.999 0 1 0 1.414 1.414L10 11.414l4.293 4.293a.997.997 0 0 0 1.414 0 .999.999 0 0 0 0-1.414L11.414 10z" fill-rule="evenodd"></path></svg>
                        </div>
                    </div>
                    {% unless configs.afterSubmit.message == "" %}
                    <div class="message success">
                        <div class="content">{{configs.afterSubmit.message}}</div>
                        <div class="dismiss" onclick="Globo.dismiss(this)">
                            <svg viewBox="0 0 20 20" class="" focusable="false" aria-hidden="true"><path d="M11.414 10l4.293-4.293a.999.999 0 1 0-1.414-1.414L10 8.586 5.707 4.293a.999.999 0 1 0-1.414 1.414L8.586 10l-4.293 4.293a.999.999 0 1 0 1.414 1.414L10 11.414l4.293 4.293a.997.997 0 0 0 1.414 0 .999.999 0 0 0 0-1.414L11.414 10z" fill-rule="evenodd"></path></svg>
                        </div>
                    </div>
                    {% endunless %}
                    <div class="footer wizard__footer">
                        {% if configs.footer.description != '' and configs.footer.description != '<p><br></p>' %}
                        <div class="description globo-description">{{configs.footer.description}}</div>
                        {% endif %}
                        <button type="button" class="action previous  {{configs.appearance.style}}-button">{{configs.footer.previousText}}</button>
                        <button type="button" class="action next submit {{configs.appearance.style}}-button" data-submitting-text="{{configs.footer.submittingText}}" data-submit-text='<span class="spinner"></span>{{configs.footer.submitText}}' data-next-text={{configs.footer.nextText}} ><span class="spinner"></span>{{configs.footer.nextText}}</button>
                        <h1 class="wizard__congrats-message"></h1>
                    </div>
                </div>
            </div>
        {% else %}
            <div class="content flex-wrap block-container" data-id={{formId}}>
                {% for element in configs.elements %}
                    {% if element.type != "group" %}
                        {{ element | renderElement : partialElement , configs }}
                    {% else %}
                        {% for el in element.elements %}
                            {{ el | renderElement : partialElement , configs }}
                        {% endfor %}
                    {% endif %}
                {% endfor %}
                {% if configs.reCaptcha.enable = true %}
                    <div class="globo-form-control">
                        <div class="globo-g-recaptcha" data-sitekey="{{Globo.FormBuilder.shop.settings.reCaptcha.siteKey}}"></div>
                        <input type="hidden" name="reCaptcha" id="reCaptcha">
                        <small class="messages"></small>
                    </div>
                {% endif %}
            </div>
            {% if Globo.FormBuilder.shop.pricing.features.removeCopyright == false %}
            <p style="text-align: right;font-size:small;">Made by <a target="_blank" rel="nofollow" href="https://apps.shopify.com/form-builder-contact-form">Powerful Contact Form Builder</a> </p>
            {% endif %}
            <div class="message error">
                <div class="content"></div>
                <div class="dismiss" onclick="Globo.dismiss(this)">
                    <svg viewBox="0 0 20 20" class="" focusable="false" aria-hidden="true"><path d="M11.414 10l4.293-4.293a.999.999 0 1 0-1.414-1.414L10 8.586 5.707 4.293a.999.999 0 1 0-1.414 1.414L8.586 10l-4.293 4.293a.999.999 0 1 0 1.414 1.414L10 11.414l4.293 4.293a.997.997 0 0 0 1.414 0 .999.999 0 0 0 0-1.414L11.414 10z" fill-rule="evenodd"></path></svg>
                </div>
            </div>
            {% unless configs.afterSubmit.message == "" %}
            <div class="message success">
                <div class="content">{{configs.afterSubmit.message}}</div>
                <div class="dismiss" onclick="Globo.dismiss(this)">
                    <svg viewBox="0 0 20 20" class="" focusable="false" aria-hidden="true"><path d="M11.414 10l4.293-4.293a.999.999 0 1 0-1.414-1.414L10 8.586 5.707 4.293a.999.999 0 1 0-1.414 1.414L8.586 10l-4.293 4.293a.999.999 0 1 0 1.414 1.414L10 11.414l4.293 4.293a.997.997 0 0 0 1.414 0 .999.999 0 0 0 0-1.414L11.414 10z" fill-rule="evenodd"></path></svg>
                </div>
            </div>
            {% endunless %}
            <div class="footer">
                {% if configs.footer.description != '' and configs.footer.description != '<p><br></p>' %}
                <div class="description globo-description">{{configs.footer.description}}</div>
                {% endif %}
                <button class="action submit {{configs.appearance.style}}-button"><span class="spinner"></span>{{configs.footer.submitText}}</button>
            </div>
        {% endif %}
        {% if Globo.FormBuilder.customer %}
            <input type="hidden" value="{{Globo.FormBuilder.customer.id}}" name="customer[id]">
            <input type="hidden" value="{{Globo.FormBuilder.customer.email}}" name="customer[email]">
            <input type="hidden" value="{{Globo.FormBuilder.customer.name}}" name="customer[name]">
        {% endif %}
        <input type="hidden" value="{{Globo.FormBuilder.page.title}}" name="page[title]">
        <input type="hidden" value="{{Globo.FormBuilder.page.href}}" name="page[href]">

        <input type="hidden" value="" name="_keyLabel">
    </form>
    {% unless configs.afterSubmit.message == "" %}
    <div class="message success">
        <div class="content">{{configs.afterSubmit.message}}</div>
        <div class="dismiss" onclick="Globo.dismiss(this)">
            <svg viewBox="0 0 20 20" class="" focusable="false" aria-hidden="true"><path d="M11.414 10l4.293-4.293a.999.999 0 1 0-1.414-1.414L10 8.586 5.707 4.293a.999.999 0 1 0-1.414 1.414L8.586 10l-4.293 4.293a.999.999 0 1 0 1.414 1.414L10 11.414l4.293 4.293a.997.997 0 0 0 1.414 0 .999.999 0 0 0 0-1.414L11.414 10z" fill-rule="evenodd"></path></svg>
        </div>
    </div>
    {% endunless %}
</div>
{% if configs.appearance.layout == 'float'  %}
{% if configs.appearance.floatingIcon != '' or configs.appearance.floatingText != '' %}
{% if configs.appearance.floatingText != '' and configs.appearance.floatingText != null %}
{% assign circle = '' %}
{% else %}
{% assign circle = 'circle' %}
{% endif %}
<div class="floating-button {{circle}} {{configs.appearance.position}}" onclick="Globo.FormBuilder.showFloatingForm(this)">
    <div class="fabLabel">
        {{configs.appearance.floatingIcon}}
        {{configs.appearance.floatingText}}
    </div>
</div>
{% endif %}
<div class="overlay" onclick="Globo.FormBuilder.hideFloatingForm(this)"></div>
{% endif %}
</div>
{% endraw %}
</script>
<script type="text/template" id="globo-formbuilder-element">
{% raw %}
    {% assign columnWidth = element.columnWidth | parseInt %}
{% assign columnWidthClass = "layout-" | append : columnWidth | append : "-column" %}
{% assign attrInput = "" %}

{% if element.conditionalField && element.onlyShowIf && element.onlyShowIf != false %}
{% assign columnWidthClass = columnWidthClass | append : " conditional-field" %}
{% assign escapeConnectedValue = element[element.onlyShowIf] | escapeHtml %}
{% assign attrInput = "disabled='disabled'" %}
{% assign dataAttr = dataAttr | append : " data-connected-id='" | append : element.onlyShowIf | append : "'" %}
{% assign dataAttr = dataAttr | append : " data-connected-value='" | append : escapeConnectedValue | append : "'" %}
{% endif %}

{% case element.type %}
{% when "text" %}
<div class="globo-form-control {{columnWidthClass}}" {{dataAttr}}>
    <label for="{{element.id}}" class="{{configs.appearance.style}}-label globo-label"><span class="label-content">{{element.label}}</span>{% if element.required %}<span class="text-danger text-smaller"> *</span>{% endif %}</label>
    <input type="text" {{attrInput}} data-type="{{element.type}}" class="{{configs.appearance.style}}-input" id="{{element.id}}" name="{{element.id}}" placeholder="{{element.placeholder}}" {% if element.required %}presence{% endif %} >
    {% if element.description != '' %}
        <small class="help-text globo-description">{{element.description}}</small>
    {% endif %}
    <small class="messages"></small>
</div>
{% when "name" %}
<div class="globo-form-control {{columnWidthClass}}" {{dataAttr}}>
    <label for="{{element.id}}" class="{{configs.appearance.style}}-label globo-label"><span class="label-content">{{element.label}}</span>{% if element.required %}<span class="text-danger text-smaller"> *</span>{% endif %}</label>
    <input type="text" {{attrInput}} data-type="{{element.type}}" class="{{configs.appearance.style}}-input" id="{{element.id}}" name="{{element.id}}" placeholder="{{element.placeholder}}" {% if element.required %}presence{% endif %} >
    {% if element.description != '' %}
        <small class="help-text globo-description">{{element.description}}</small>
    {% endif %}
    <small class="messages"></small>
</div>
{% when "email" %}
<div class="globo-form-control {{columnWidthClass}}" {{dataAttr}}>
    <label for="{{element.id}}" class="{{configs.appearance.style}}-label globo-label"><span class="label-content">{{element.label}}</span>{% if element.required %}<span class="text-danger text-smaller"> *</span>{% endif %}</label>
    <input type="text" {{attrInput}} data-type="{{element.type}}" class="{{configs.appearance.style}}-input" id="{{element.id}}" name="{{element.id}}" placeholder="{{element.placeholder}}" {% if element.required %}presence{% endif %} >
    {% if element.description != '' %}
        <small class="help-text globo-description">{{element.description}}</small>
    {% endif %}
    <small class="messages"></small>
</div>
{% when "textarea" %}
<div class="globo-form-control {{columnWidthClass}}" {{dataAttr}}>
    <label for="{{element.id}}" class="{{configs.appearance.style}}-label globo-label"><span class="label-content">{{element.label}}</span>{% if element.required %}<span class="text-danger text-smaller"> *</span>{% endif %}</label>
    <textarea id="{{element.id}}" {{attrInput}} data-type="{{element.type}}" class="{{configs.appearance.style}}-input" rows="3" name="{{element.id}}" placeholder="{{element.placeholder}}" {% if element.required %}presence{% endif %} ></textarea>
    {% if element.description != '' %}
        <small class="help-text globo-description">{{element.description}}</small>
    {% endif %}
    <small class="messages"></small>
</div>
{% when "url" %}
<div class="globo-form-control {{columnWidthClass}}" {{dataAttr}}>
    <label for="{{element.id}}" class="{{configs.appearance.style}}-label globo-label"><span class="label-content">{{element.label}}</span>{% if element.required %}<span class="text-danger text-smaller"> *</span>{% endif %}</label>
    <input type="text" {{attrInput}} data-type="{{element.type}}" class="{{configs.appearance.style}}-input" id="{{element.id}}" name="{{element.id}}" placeholder="{{element.placeholder}}" {% if element.required %}presence{% endif %} >
    {% if element.description != '' %}
        <small class="help-text globo-description">{{element.description}}</small>
    {% endif %}
    <small class="messages"></small>
</div>
{% when "phone" %}
<div class="globo-form-control {{columnWidthClass}}" {{dataAttr}}>
    <label for="{{element.id}}" class="{{configs.appearance.style}}-label globo-label"><span class="label-content">{{element.label}}</span>{% if element.required %}<span class="text-danger text-smaller"> *</span>{% endif %}</label>
    <input type="text" {{attrInput}} data-type="{{element.type}}" class="{{configs.appearance.style}}-input" id="{{element.id}}" name="{{element.id}}" placeholder="{{element.placeholder}}" {% if element.required %}presence{% endif %} >
    {% if element.description != '' %}
        <small class="help-text globo-description">{{element.description}}</small>
    {% endif %}
    <small class="messages"></small>
</div>
{% when "number" %}
<div class="globo-form-control {{columnWidthClass}}" {{dataAttr}}>
    <label for="{{element.id}}" class="{{configs.appearance.style}}-label globo-label"><span class="label-content">{{element.label}}</span>{% if element.required %}<span class="text-danger text-smaller"> *</span>{% endif %}</label>
    <input type="number" {{attrInput}} class="{{configs.appearance.style}}-input" id="{{element.id}}" name="{{element.id}}" placeholder="{{element.placeholder}}" {% if element.required %}presence{% endif %} >
    {% if element.description != '' %}
        <small class="help-text globo-description">{{element.description}}</small>
    {% endif %}
    <small class="messages"></small>
</div>
{% when "password" %}
<div class="globo-form-control {{columnWidthClass}}" {{dataAttr}}>
    <label for="{{element.id}}" class="{{configs.appearance.style}}-label globo-label"><span class="label-content">{{element.label}}</span>{% if element.required %}<span class="text-danger text-smaller"> *</span>{% endif %}</label>
    <input type="password" data-type="{{element.type}}" {{attrInput}} class="{{configs.appearance.style}}-input" id="{{element.id}}" name="{{element.id}}" {% if element.validationRule %} data-validate-rule="{{element.validationRule}}" {% endif %} {% if element.validationRule == 'advancedValidateRule' %} data-advanced-validate-rule="{{element.advancedValidateRule}}" {% endif %} placeholder="{{element.placeholder}}" {% if element.required %}presence{% endif %} >
    {% if element.description != '' %}
        <small class="help-text globo-description">{{element.description}}</small>
    {% endif %}
    <small class="messages"></small>
</div>
{% if element.hasConfirm %}
    <div class="globo-form-control {{columnWidthClass}}" {{dataAttr}}>
        <label for="{{element.id}}Confirm" class="{{configs.appearance.style}}-label globo-label"><span class="label-content">{{element.labelConfirm}}</span>{% if element.required %}<span class="text-danger text-smaller"> *</span>{% endif %}</label>
        <input type="password" data-type="{{element.type}}" data-additional-type="confirm-{{element.type}}" data-connected-element="{{element.id}}" {% if element.validationRule %} data-validate-rule="{{element.validationRule}}" {% endif %} {% if element.validationRule == 'advancedValidateRule' %} data-advanced-validate-rule="{{element.advancedValidateRule}}" {% endif %}  {{attrInput}} class="{{configs.appearance.style}}-input" id="{{element.id}}Confirm" name="{{element.id}}Confirm" placeholder="{{element.placeholderConfirm}}" {% if element.required %}presence{% endif %} >
        {% if element.descriptionConfirm != '' %}
            <small class="help-text globo-description">{{element.descriptionConfirm}}</small>
        {% endif %}
        <small class="messages"></small>
    </div>
{% endif %}
{% when "datetime" %}
<div class="globo-form-control {{columnWidthClass}}" {{dataAttr}}>
    <label for="{{element.id}}" class="{{configs.appearance.style}}-label globo-label"><span class="label-content">{{element.label}}</span>{% if element.required %}<span class="text-danger text-smaller"> *</span>{% endif %}</label>
    <input
        type="text"
        {{attrInput}}
        data-type="{{element.type}}"
        class="{{configs.appearance.style}}-input"
        id="{{element.id}}"
        name="{{element.id}}"
        placeholder="{{element.placeholder}}"
        {% if element.required %}presence{% endif %}
        data-format="{{element.format}}"
        {% if element.otherLang %}
        data-locale="{{element.localization}}"
        {% endif %}
        dataDateFormat="{{element.date-format}}"
        dataTimeFormat="{{element.time-format}}"
        {% if element.format == 'date' and element.isLimitDate %}
            limitDateType="{{element.limitDateType}}"
            {% if element.limitDateSpecificEnabled %}
                limitDateSpecificDates="{{element.limitDateSpecificDates}}"
            {% endif %}
            {% if element.limitDateRangeEnabled %}
                limitDateRangeDates="{{element.limitDateRangeDates}}"
            {% endif %}
            {% if element.limitDateDOWEnabled %}
                limitDateDOWDates="{{element.limitDateDOWDates}}"
            {% endif %}
        {% endif %}
    >
    {% if element.description != '' %}
        <small class="help-text globo-description">{{element.description}}</small>
    {% endif %}
    <small class="messages"></small>
</div>
{% when "file" %}
<div class="globo-form-control {{columnWidthClass}}" {{dataAttr}}>
    <label for="{{element.id}}" class="{{configs.appearance.style}}-label globo-label"><span class="label-content">{{element.label}}</span>{% if element.required %}<span class="text-danger text-smaller"> *</span>{% endif %}</label>
    <input type="file" {{attrInput}} data-type="{{element.type}}" class="{{configs.appearance.style}}-input" id="{{element.id}}" {% if element.allowed-multiple %} multiple name="{{element.id}}[]" {% else %} name="{{element.id}}" {% endif %}
        placeholder="{{element.placeholder}}" {% if element.required %}presence{% endif %} data-allowed-extensions="{{element.allowed-extensions | join : ',' }}">
    {% if element.description != '' %}
        <small class="help-text globo-description">{{element.description}}</small>
    {% endif %}
    <small class="messages"></small>
</div>
{% when "checkbox" %}
<div class="globo-form-control {{columnWidthClass}}" {{dataAttr}}>
    <legend class="{{configs.appearance.style}}-label globo-label"><span class="label-content">{{element.label}}</span>{% if element.required %}<span class="text-danger text-smaller"> *</span>{% endif %}</legend>
    {% assign options = element.options | optionsToArray %}
    <ul>
        {% for option in options %}
            <li>
                <div class="checkbox-wrapper">
                    <input class="checkbox-input" {{attrInput}} id="{{element.id}}-{{option}}-{{uniqueId}}" type="checkbox" data-type="{{element.type}}" name="{{element.id}}[]" {% if element.required %}presence{% endif %} value="{{option}}">
                    <label class="checkbox-label globo-option" for="{{element.id}}-{{option}}-{{uniqueId}}">{{option}}</label>
                </div>
            </li>

        {% endfor %}
    </ul>
    {% if element.description != '' %}
        <small class="help-text globo-description">{{element.description}}</small>
    {% endif %}
    <small class="messages"></small>
</div>
{% when "radio" %}
<div class="globo-form-control {{columnWidthClass}}" {{dataAttr}}>
    <legend class="{{configs.appearance.style}}-label globo-label"><span class="label-content">{{element.label}}</span>{% if element.required %}<span class="text-danger text-smaller"> *</span>{% endif %}</legend>
    {% assign options = element.options | optionsToArray %}
    <ul>
        {% for option in options %}
        <li>
            <div class="radio-wrapper">
                <input class="radio-input" {{attrInput}} id="{{element.id}}-{{option}}-{{uniqueId}}" type="radio" data-type="{{element.type}}" name="{{element.id}}" {% if element.required %}presence{% endif %} value="{{option}}">
                <label class="radio-label globo-option" for="{{element.id}}-{{option}}-{{uniqueId}}">{{option}}</label>
            </div>
        </li>
        {% endfor %}
    </ul>
    {% if element.description != '' %}
        <small class="help-text globo-description">{{element.description}}</small>
    {% endif %}
    <small class="messages"></small>
</div>
{% when "select" %}
<div class="globo-form-control {{columnWidthClass}}" {{dataAttr}}>
    <label for="{{element.id}}" class="{{configs.appearance.style}}-label globo-label"><span class="label-content">{{element.label}}</span>{% if element.required %}<span class="text-danger text-smaller"> *</span>{% endif %}</label>
    {% assign options = element.options | optionsToArray %}
    <select name="{{element.id}}" {{attrInput}} id="{{element.id}}" class="{{configs.appearance.style}}-input" {% if element.required %}presence{% endif %}>
        <option selected="selected" value="" disabled="disabled">{{element.placeholder}}</option>
        {% for option in options %}
        <option value="{{option}}">{{option}}</option>
        {% endfor %}
    </select>
    {% if element.description != '' %}
        <small class="help-text globo-description">{{element.description}}</small>
    {% endif %}
    <small class="messages"></small>
</div>
{% when "country" %}
<div class="globo-form-control {{columnWidthClass}}" {{dataAttr}}>
    <label for="{{element.id}}" class="{{configs.appearance.style}}-label globo-label"><span class="label-content">{{element.label}}</span>{% if element.required %}<span class="text-danger text-smaller"> *</span>{% endif %}</label>
    {% assign options = element.options | optionsToArray %}
    <select name="{{element.id}}" {{attrInput}} id="{{element.id}}" class="{{configs.appearance.style}}-input" {% if element.required %}presence{% endif %}>
        <option selected="selected" value="" disabled="disabled">{{element.placeholder}}</option>
        {% for option in options %}
        <option value="{{option}}">{{option}}</option>
        {% endfor %}
    </select>
    {% if element.description != '' %}
        <small class="help-text globo-description">{{element.description}}</small>
    {% endif %}
    <small class="messages"></small>
</div>
{% when "heading" %}
<div class="globo-form-control {{columnWidthClass}}" {{dataAttr}}>
    <h3 class="heading-title globo-heading">{{element.heading}}</h3>
    <p class="heading-caption">{{element.caption}}</p>
</div>
{% when "paragraph" %}
<div class="globo-form-control {{columnWidthClass}}" {{dataAttr}}>
    <label for="{{element.id}}" class="{{configs.appearance.style}}-label"><span class="label-content">{{element.label}}</span></label>
    <div class="globo-paragraph">{{element.text}}</div>
</div>
{% when "rating-star" %}
<div class="globo-form-control {{columnWidthClass}}" {{dataAttr}}>
    <label for="{{element.id}}" class="{{configs.appearance.style}}-label globo-label"><span class="label-content">{{element.label}}</span>{% if element.required %}<span class="text-danger text-smaller"> *</span>{% endif %}</label>
    <div class="star-rating">
        <fieldset>
            <input type="radio" {{attrInput}} data-type="{{element.type}}" {% if element.required %}presence{% endif %} id="{{element.id}}-5-stars" name="{{element.id}}" value="5" /><label for="{{element.id}}-5-stars" title="5 Stars">5 stars</label>
            <input type="radio" {{attrInput}} data-type="{{element.type}}" {% if element.required %}presence{% endif %} id="{{element.id}}-4-stars" name="{{element.id}}" value="4" /><label for="{{element.id}}-4-stars" title="4 Stars">4 stars</label>
            <input type="radio" {{attrInput}} data-type="{{element.type}}" {% if element.required %}presence{% endif %} id="{{element.id}}-3-stars" name="{{element.id}}" value="3" /><label for="{{element.id}}-3-stars" title="3 Stars">3 stars</label>
            <input type="radio" {{attrInput}} data-type="{{element.type}}" {% if element.required %}presence{% endif %} id="{{element.id}}-2-stars" name="{{element.id}}" value="2" /><label for="{{element.id}}-2-stars" title="2 Stars">2 stars</label>
            <input type="radio" {{attrInput}} data-type="{{element.type}}" {% if element.required %}presence{% endif %} id="{{element.id}}-1-star" name="{{element.id}}" value="1" /><label for="{{element.id}}-1-star" title="1 Star">1 star</label>
        </fieldset>
    </div>
    {% if element.description != '' %}
        <small class="help-text globo-description">{{element.description}}</small>
    {% endif %}
    <small class="messages"></small>
</div>
{% when "devider" %}
<div class="globo-form-control {{columnWidthClass}}" {{dataAttr}} >
    <hr>
</div>
{% when "hidden" %}
<div class="globo-form-control {{columnWidthClass}}" {{dataAttr}} style="display: none;visibility: hidden;">
    <label for="{{element.id}}" class="{{configs.appearance.style}}-label"><span class="label-content">{{element.label}}</span>{% if element.required %}<span class="text-danger text-smaller"> *</span>{% endif %}</label>
    {% if element.dataType == 'fixed' %}
        <input type="hidden" data-type="{{element.dataType}}" id="{{element.id}}" name="{{element.id}}" value="{{element.fixedValue}}">
    {% else %}
        <input type="hidden" data-type="{{element.dataType}}" id="{{element.id}}" name="{{element.id}}" value="" >
    {% endif %}
</div>
{% else %}

{% endcase %}
{% endraw %}
</script>

{{ 'globo.formbuilder.data.20198.js' | asset_url | script_tag }}
{{ 'globo.formbuilder.js' | asset_url | script_tag }}