# ConvertKit Pre-Populate

This Script Pre-Populates ConvertKit Landing Pages with a known subscriber's First Name and Email. There are multiple reasons to pre-populate a form, but the driving need is to reduce friction to increase opt-in rates. Use this when doing a partner promo or even just segmenting your own subscribers into a new segment for a promotion, webinar, or product launch etc.

## Features

- **Easy Integration**: Drop-in script for ConvertKit landing pages
- **Input Validation**: Email format validation and XSS protection
- **Security**: Automatic input sanitization to prevent malicious code injection
- **Configuration**: Customize field mappings, validation rules, and behavior
- **Error Handling**: Robust error handling with optional debug mode
- **Callbacks**: Success/error callbacks for custom logic
- **Backwards Compatible**: Works with existing implementations

## Quick Start (Basic Usage)

To use this script on your pages, add this script to your opt-in page. In ConvertKit, add the HTML Block element to your page. You'll need to wrap the code in script tags as shown below.

```html
<script src="path/to/pre-pop.js"></script>
```

That's it! The script will automatically populate form fields from URL parameters `fn` (first name) and `em` (email).

## Advanced Usage

For more control, you can configure CKPrePop with custom options:

```html
<script src="path/to/pre-pop.js"></script>
<script>
    CKPrePop.init({
        // Custom field mappings
        fields: {
            fn: 'fields[first_name]',
            ln: 'fields[last_name]',      // Add last name
            em: 'email_address',
            ph: 'fields[phone_number]'     // Add phone
        },

        // Validation settings
        validation: {
            enabled: true,
            maxLength: 255,
            allowedEmailDomains: ['example.com', 'company.com'], // Optional whitelist
            sanitizeInput: true
        },

        // Enable debug mode for development
        debug: true,

        // Clear fields on error
        clearOnError: false,

        // Success callback
        onSuccess: function(data) {
            console.log('Pre-populated:', data);
            // Send analytics event, etc.
        },

        // Error callback
        onError: function(error) {
            console.error('Error:', error.message);
        },

        // Validation error callback
        onValidationError: function(error) {
            console.warn('Invalid input:', error.param, error.message);
        }
    });
</script>
```

## Configuration Options

### `fields` (Object)
Map URL parameters to form field names. Default:
```javascript
{
    fn: 'fields[first_name]',
    em: 'email_address'
}
```

### `validation` (Object)
Control validation behavior:
- `enabled` (Boolean): Enable/disable validation. Default: `true`
- `maxLength` (Number): Maximum input length. Default: `255`
- `allowedEmailDomains` (Array): Whitelist email domains. Empty = allow all. Default: `[]`
- `sanitizeInput` (Boolean): Sanitize inputs to prevent XSS. Default: `true`

### `debug` (Boolean)
Enable console logging for debugging. Default: `false`

### `clearOnError` (Boolean)
Clear form fields if an error occurs. Default: `false`

### Callbacks
- `onSuccess(data)`: Called when fields are successfully populated
- `onError(error)`: Called on general errors
- `onValidationError(error)`: Called when validation fails

## Security Features

### XSS Protection
All inputs are automatically sanitized to prevent cross-site scripting attacks. The following characters are escaped:
- `<` → `&lt;`
- `>` → `&gt;`
- `"` → `&quot;`
- `'` → `&#x27;`
- `/` → `&#x2F;`

### Email Validation
Email addresses are validated against RFC 5322 format before being set in the form.

### Input Length Limits
Inputs exceeding `maxLength` (default 255 characters) are rejected to prevent buffer overflow attempts.

### Domain Whitelisting
Optionally restrict email addresses to specific domains:
```javascript
CKPrePop.init({
    validation: {
        allowedEmailDomains: ['yourdomain.com', 'partner.com']
    }
});
```

## URL Format

Next format your landing page url with fn and em url variables on your ConvertKit Landing page url

So for example if your ConvertKit url is: 

`https://your-ck-landingpageurl.ck.page/12345678`

The template for pre-population would be:

`https://your-ck-landingpageurl.ck.page/12345678?fn={{ subscriber.first_name }}&em={{ subscriber.email_address }}`

Once processed, the link will look something like this for someone with a first name of "`James`" and an email address of "`james@smith.emailaddress`"

`https://your-ck-landingpageurl.ck.page/12345678?fn=James&em=james@smith.emailaddress`

## Example Code For Various Email Service Providers
This link can also me used by partners with other esps to send you traffic. Most Email Service Providers have Tags to dynamically insert a user's first name and email into the url for pre-population, here are some examples from other major email providers.

### MailChimp
`https://your-ck-landingpageurl.ck.page/12345678?fn=*|FNAME|*&em=*|EMAIL|*`

### InfusionSoft
`https://your-ck-landingpageurl.ck.page/12345678?fn=~Contact.FirstName~&em=~Contact.Email~`

### Drip
`https://your-ck-landingpageurl.ck.page/12345678?fn={{ subscriber.first_name }}&em={{ subscriber.email }}`

### Aweber
`https://your-ck-landingpageurl.ck.page/12345678?fn={{ subscriber.first_name }}&em={{ subscriber.email }}`

### ActiveCampaign
`https://your-ck-landingpageurl.ck.page/12345678?fn=%FIRSTNAME%&em=%EMAIL%`

### Mailer Lite
`https://your-ck-landingpageurl.ck.page/12345678?fn={$name}&em={$email} `

### Sendy
`https://your-ck-landingpageurl.ck.page/12345678?fn=[Name]&em=[Email]`

### GetResponse
`https://your-ck-landingpageurl.ck.page/12345678?fn=[[firstname]]&em=[[email]]`

### Campaign Monitor
`https://your-ck-landingpageurl.ck.page/12345678?fn=[firstname]&em=[email]`

## Inline Usage (ConvertKit HTML Block)

If you prefer to paste the script directly into ConvertKit's HTML Block instead of hosting it externally:

### Basic (Minimal Code)
```html
<script>
(function(){const u=new URLSearchParams(location.search);for(let[n,v]of u){const f=document.getElementsByName(n.toLowerCase()==='fn'?'fields[first_name]':n.toLowerCase()==='em'?'email_address':null)[0];if(f)f.value=v||'';}})();
</script>
```

### Full Featured (With Validation)
Copy the entire contents of `pre-pop.js` and wrap it in `<script>` tags:
```html
<script>
    // Paste the entire pre-pop.js contents here
</script>

<!-- Optional: Custom configuration -->
<script>
    CKPrePop.init({
        debug: true,
        onSuccess: function(data) {
            // Track in analytics
            if (window.gtag) {
                gtag('event', 'form_prepopulated', {
                    fields: Object.keys(data).join(',')
                });
            }
        }
    });
</script>
```

## Examples

### Example 1: Basic Pre-Population
```html
<!-- In ConvertKit HTML Block -->
<script src="https://yourdomain.com/pre-pop.js"></script>
```
URL: `https://your-page.ck.page/abc?fn=John&em=john@example.com`

### Example 2: Debug Mode
```html
<script src="https://yourdomain.com/pre-pop.js"></script>
<script>
    CKPrePop.init({
        debug: true  // See console logs during development
    });
</script>
```

### Example 3: Custom Fields + Analytics
```html
<script src="https://yourdomain.com/pre-pop.js"></script>
<script>
    CKPrePop.init({
        fields: {
            fn: 'fields[first_name]',
            ln: 'fields[last_name]',
            em: 'email_address',
            co: 'fields[company]'
        },
        onSuccess: function(data) {
            // Send to Google Analytics
            if (window.gtag) {
                gtag('event', 'prepopulated', {
                    event_category: 'form',
                    event_label: 'fields_populated'
                });
            }
        }
    });
</script>
```
URL: `https://your-page.ck.page/abc?fn=John&ln=Doe&em=john@example.com&co=Acme`

### Example 4: Domain Restrictions
```html
<script src="https://yourdomain.com/pre-pop.js"></script>
<script>
    CKPrePop.init({
        validation: {
            allowedEmailDomains: ['company.com', 'partner.com']
        },
        onValidationError: function(error) {
            alert('Only company.com and partner.com emails are allowed');
        }
    });
</script>
```

## Migration from v1

If you're upgrading from the basic version, the new version is **100% backwards compatible**. Simply replace your script and it will work exactly as before.

To take advantage of new features, optionally add configuration:
```javascript
// Old version - still works!
// No changes needed

// New version - add features as needed
CKPrePop.init({
    debug: true,  // Start with debug to see what's happening
    validation: {
        enabled: true  // Enable security features
    }
});
```

## Development

### Building the Minified Version

To create a minified version for production use:

```bash
npm run minify
```

This uses [terser](https://terser.org/) via npx (no installation required) to create a compressed version that's ~72% smaller than the original.

To see compression stats:
```bash
npm run minify:stats
```

### Testing

Run syntax validation:
```bash
npm test
```

Open `test.html` in a browser to interactively test the pre-population functionality.

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- IE11: Partial support (URLSearchParams polyfill recommended)

## Troubleshooting

### Fields not populating?
1. Enable debug mode: `CKPrePop.init({ debug: true })`
2. Check browser console for errors
3. Verify URL parameters are present in the URL
4. Ensure field names match ConvertKit's form field names

### Email validation failing?
1. Check email format is valid (has `@` and domain)
2. If using `allowedEmailDomains`, verify domain is in whitelist
3. Check console for validation error details

### XSS protection blocking valid input?
If you need to allow special characters:
```javascript
CKPrePop.init({
    validation: {
        sanitizeInput: false  // Disable XSS protection (not recommended)
    }
});
```

## License

MIT License - Copyright (c) 2022 tracking202
