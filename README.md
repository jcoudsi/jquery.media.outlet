# jQuery Media Outlet 1.0

Features
--------

- Upload media in a specified directory
- Get media from an URL in order to display it in the page
- The input URL is checked by a regex and a message is displayed in case of error.
- The supported media uploaded or called with their URL are displayed in a preview zone.

- File types supported for upload mode :
  - png
  - gif
  - jpg

- Any media URL can be used, but the plugin display a preview only for these types :
  - png
  - gif
  - jpg
  - youtube video

Requirements
------------
jQuery Core v1.10.x or higher required.

Browser support
---------------
Tested with :

- Internet Explorer 10
-	Chrome 38
- Firefox 31

Documentation
=============
`.mediaOutlet(options)`
--------------------
Turns an HTML element into a media outlet.

Options
-------

### urlService (mandatory)
The URL of the upload service (for example a PHP script)

### uploadDir
The name of the directory where the media will be uploaded on your server. If it'ns not specified, the file will be uploaded in the directory where the PHP upload script is executed.

### defaultMode
The default displayed mode. Authorized values are :
- upload (default value)
- url

### loadedMedia
The attribute name of the used HTML element which specified the media file URL to display when the plugin in display once the page is loaded.

### noPreviewImage
The attribute name of the used HTML element which specified the image file URL to display when there isn't preview to display for the chosen media

### uploadedFileTypes
The authorized file types for upload mode. Following types can be used :
- png
- gif
- jpg

### maxFileSize
The maximum size in bytes of an uploaded media. The default value is 10485760 bytes (10 megabytes)

### preview
Specify if the media preview is displayed (true) or not (false)

### onSuccess
Callback function which defines some stuff to do when the upload/media get by URL is done with success.
This function must be like the following : `function(result, $mediaOutlet) { //some stuff }`
- result parameter provides some information in an object :
  - mediaName : the name of the uploaded file (only for upload mode)
  - mediaType : the media type 
  - mediaUrl:mediaUrl : the media URL
  - mediaSelectionType : "url" or "upload" depending the chosen mode
- $mediaOutlet is the HTML DOM used element  

### onError
Callback function which defines some stuff to do when the upload fails.
This function must be like the following : `function(error, $mediaOutlet) { //some stuff }`
- error parameter provides information about the upload error (AJAX technical error)
- $mediaOutlet is the HTML DOM used element  

Examples
========

HTML
----

```html
<div class="media_outlet" data-loadedMedia="[media file URL]" data-noPreviewImage="[image URL]" data-mediaFile="" ></div>`
```
Javascript
----------

```javascript
$('.media_outlet').mediaOutlet({
        urlService:url,
        uploadDir:'media',
        defaultMode:'upload',
        loadedMedia:'data-loadedMedia',
        noPreviewImage:'data-noPreviewImage',
        onSuccess:function(result, $mediaOutlet)
        {
            //Custom code to store the media name or the media URL in a specified attribute of the HTML element used
            //Then, this attribute can be read with Javascript 
            if (result.mediaSelectionType === 'upload')
            {
                $mediaOutlet.attr('data-mediaFile', result.mediaName);
            }
            else if (result.mediaSelectionType === 'url')
            {
                $mediaOutlet.attr('data-mediaFile', result.mediaUrl);
            }
        },
        onError:function(error)
        {
            console.log('error : ' + error);
        }
    });`
```
