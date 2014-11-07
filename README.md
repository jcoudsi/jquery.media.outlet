# jQuery Media Outlet 1.0

jQuery Media Outlet provides a simple interface to :
- upload media in a specified directory
- get media from an URL in order to display it in the page

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
The authorized file types. Following types can be used :
- png
- gif
- jpg

### maxFileSize
The maximum size in bytes of an uploaded media. The default value is 10485760 bytes (10 megabytes)

### preview
Specify if the media preview is display (true) or not (false)

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
This function must be like the following : `onError(error, $mediaOutlet) { //some stuff }`
- error parameter provides information about the upload error
- $mediaOutlet is the HTML DOM used element  
