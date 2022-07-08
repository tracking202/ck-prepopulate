# ConvertKit Pre-Populate

This Simple Script Pre-Populates ConvertKit Landing Pages with a known subscriber's First Name and Email. There are multiple reasons to pre-populate a form, but the driving need is to reduce friction to increase opt-in rates. Use this when doing a partner promo or even just segmenting your own subscribers into a new segment for a promotion, webinar, or product launch etc.

To use this script on your pages, you'll need to set the fn and em url variables on your ConvertKit Landing page url

So for example if your ConvertKit url is: 

`https://your-ck-landingpageurl.ck.page/12345678`

The template for pre-population would be:

`https://your-ck-landingpageurl.ck.page/12345678?fn={{first-name}}&em={{email}}`

To pre-populate the page with first name "`James`" and an email address of "`james@smith.emailaddress`" use

`https://your-ck-landingpageurl.ck.page/12345678?fn=James&em=james@smith.emailaddress`

## Example Code For Various Email Service Providers
Most Email Service Providers have Tags to dynamically insert a user's first name and email into the url for pre-population.

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
