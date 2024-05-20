# ConvertKit Pre-Populate

This Simple Script Pre-Populates ConvertKit Landing Pages with a known subscriber's First Name and Email. There are multiple reasons to pre-populate a form, but the driving need is to reduce friction to increase opt-in rates. Use this when doing a partner promo or even just segmenting your own subscribers into a new segment for a promotion, webinar, or product launch etc.

To use this script on your pages, add this script to your opt-in page. In ConvertKit, add the HTML Block element to your page. You'll need to wrap the code in script tags as shown below.
```html

<script>
    function getCKUrlParam(urlParam) {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const lcParams = new URLSearchParams();

        for (const [name, value] of urlParams) {
            lcParams.append(name.toLowerCase(), value);
        }

        return lcParams.get(urlParam.toLowerCase());
    }

    const name = getCKUrlParam("fn");
    const email = getCKUrlParam("em");

    document.getElementsByName("fields[first_name]")[0].value = name;
    document.getElementsByName("email_address")[0].value = email;
</script>
```


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
