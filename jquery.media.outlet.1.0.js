/*! jQuery Media Outlet plugin - v1.0 - 2014-07-11
 * https://github.com/jcoudsi/jquery.media.outlet
 * Copyright (c) 2014 Julien Coudsi; Licensed MIT */

(function($)
{

    $.fn.mediaOutlet = function(params)
    {
       return this.each(function()
       {
           //Initialization
            params = initialize($(this), params);
            /**
             * Fired when a file to upload is selected
             */
            $(this).find('.media_outlet_button_upload').change(function(event)
            {
                uploadFile($(this), params, event);
            });

            /**
             * Fired when a media URL is specified
             */
            $(this).find('.media_outlet_button_validate_url_media').click(function(event)
            {
                selectUrl($(this), params);
            });
            
       });
       
    };
    
    /**
     * Initializes the media outlet
     * 
     * @param $mediaOutlet the current media outlet DOM element
     * @param params the parameters
     */
    function initialize($mediaOutlet, params)
    {
        //Gets optionnal user parameters instead of default parameters
        params = $.extend({
            uploadDir:null, //Default upload dir
            uploadedFileTypes:'png, gif, jpg', //Authorized file types
            maxFileSize:10485760, //Max file size in bytes (10 megabytes)
            defaultMode:'upload', //Default mode to use
            preview:true, //Preview is activated
            onSuccess:null, //Optional callback function for success
            onError:null //Optional callback function for error
        }, params);
        
        generatesUploaderElements($mediaOutlet, params);

        //Hides the upload information
        var $uploadProgressBar = $mediaOutlet.find('.media_outlet_upload_progress_bar');
        var $uploadProgressInfo = $mediaOutlet.find('.media_outlet_upload_progress_info');
        $uploadProgressBar.hide();
        $uploadProgressInfo.hide();
        
        //Shows the default mode
        $mediaOutlet.children('[class$=\'_mode\']').slideUp();
        $mediaOutlet.children('.media_outlet_' + params.defaultMode + '_mode').slideDown();
        $mediaOutlet.children('.media_outlet_' + params.defaultMode + '_option').prop('checked', true);
        
        //Activates the file preview if it's enabled
        if(params.preview === true)
        {
            $mediaOutlet.find('.media_outlet_media_preview').show();
        }
        else
        {
            $mediaOutlet.find('.media_outlet_media_preview').hide();
        }

        //Media mode choice changes event
        $mediaOutlet.find('input[type=radio]').change(function(event)
        {
            //Hides all the modes
            $(this).siblings('[class$=\'_mode\']').hide();
            //Show the choosed mode
            $(this).siblings('.media_outlet_' + $(this).attr('value') + '_mode').fadeIn();
            
        });
        
        return params;
    }
    
    
    /**
     * Returns the server file name depending the user parameters
     * @param selectedFile the selected file in the form
     * @param params the parameters
     * @param $element the current element (DOM object)
     * @returns the server file name
     */
    function getServerFileName(selectedFile, params, $element)
    {
        //Gets the selected file extension
        var selectedFileExtension = null;
        if (selectedFile.name.length !== 0)
        {
           selectedFileExtension = getMediaType(selectedFile.name);
        }

        //If a name is specified by the user, this name is used with the selected file extension
        if (params.serverFileName)
        {
           
            //If the file name must be find in a data attribute of the media outlet div DOM element, the data attribute name is get from the parameters
            if (params.serverFileName.indexOf('data-') === 0)
            {
                
                //Gets the file name in the data attribute
                var dataFileName = $element.parents('div[' + params.serverFileName + ']').attr(params.serverFileName);
                
                //If the file name uses a format mask, it's is replaced by the true value
                if (isFormatMask(dataFileName))
                {
                    return replacesFormatMask(dataFileName, selectedFile);
                }
                //Otherwise, the file name is directly used from the data attribute with its extension
                else
                {
                    return dataFileName + '.' + selectedFileExtension;
                }

            }
            //The file name is specified in the parameters
            else
            {
                //If the file name uses a format mask, it's is replaced by the true value
                if (isFormatMask(params.serverFileName))
                {
                    return replacesFormatMask(params.serverFileName, selectedFile);
                }
                //Otherwise, the file name is directly used with its extension
                else
                {
                    return params.serverFileName + '.' + selectedFileExtension;
                }
            }
  
        }
        //Otherwise, the selected file name is kept (file name + extension)
        else
        {
            return selectedFile.name;
        }
    }
    
    /**
     * Checks if the fileName uses a format mask
     * @param fileName the file name
     * @returns true if there is a format mask or false
     */
    function isFormatMask(fileName)
    {
        //Checks if the fileName starts and finishes with the '!' symbol
        return (fileName.indexOf('!') === 0) && (fileName.indexOf('!', fileName.length-1) !== -1);
    }
    
    /**
     * Replaces the format mask with the true value
     * @param formatMaskFileName the file name with the format mask
     * @param selectedFile the selected file in the form
     * @returns the name with the true value instead of the format mask
     */
    function replacesFormatMask(formatMaskFileName, selectedFile)
    {
        //Returns the file name with the true value instead the format mask and without the '!' symbols
        var maskFormatReplaced = formatMaskFileName.replace('{fileName}', selectedFile.name);
        return maskFormatReplaced.substring(1, maskFormatReplaced.length-1);
    }
    
   
    /**
     * Returns the media type 
     * 
     * @param the media URL
     * @returns the media type or null if there isn't a file extension
     */
    function getMediaType(mediaUrl)
    {
        //If the media URL is a youtube video URL
        if (mediaUrl.indexOf('http') === 0 && mediaUrl.indexOf('youtube') !== -1)
        {
            return 'youtube';
        }
        else
        {
            //Gets the media extension
            var splittedUrl = mediaUrl.split('/');
            var mediaName = splittedUrl[splittedUrl.length-1];
            var splittedName = mediaName.split('.')
            
            if (splittedName.length > 1)
            {
                return splittedName[splittedName.length-1].toLowerCase();
            }
            else
            {
                return null;
            }

        }
        
        return null;
    }
    
    /**
     * Selects a media with its URL
     * 
     * @param $element the current URL input element (DOM object)
     * @param params the parameters
     */
    
    function selectUrl($element, params)
    {

        //Gets the media input URL
        var mediaUrl = $element.siblings('.media_outlet_input_url').val();

        //Check if the url is valid
        var urlRegex = new RegExp("^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?");
        if (!urlRegex.test(mediaUrl))
        {
            alert('URL non valide');
            return;
        }
        
        
        //Gets the media type
        var mediaType = getMediaType(mediaUrl);

        //Generates the media preview
        generatesPreview($element.parent().siblings('.media_outlet_media_preview'), mediaType, mediaUrl, params.noPreviewImage);

        //If the success callback function is defined, it's called with the media information
        if (params.onSuccess)
        {

            var successInformation = {
                mediaType:mediaType,
                mediaUrl:mediaUrl,
                mediaSelectionType:'url'
            };

            //Gets the media outlet div DOM element for use in callback functions
            var $mediaOutlet = $element.parent().siblings('.media_outlet_media_preview').parent('div');

            params.onSuccess(successInformation, $mediaOutlet);
        }
        

    }
   
    /**
     * Uploads a file on the server
     * 
     * @param $element the current element (DOM object)
     * @param params the parameters
     * @param event the file selection event
     */
    function uploadFile($element, params, event)
    {

        if (params.urlService)
        {
            
            //Gets the selected file
            var file = event.target.files[0];
            
            //If a file is selected
            if (file)
            {
                //Gets the file name which will be used in the server
                var serverFileName = getServerFileName(file, params, $element);
                //Gets the media type
                var mediaType = getMediaType(serverFileName);
                //Gets the media size in bytes
                var mediaSize = file.size;

                //Checks if the media size is less than 10 megabytes
                if (mediaSize > params.maxFileSize)
                {
                    alert('Le fichier fait plus de 10 megaoctets');
                    return;
                }
                
                //Checks if the media type is in the authorized file extensions list
                if (params.uploadedFileTypes.indexOf(mediaType) === -1)
                {
                    alert('Le type de fichier (' + mediaType + ') n\'est pas autorisé');
                    return;
                }
                
                //The media file is OK
                
                //Shows the upload information 
                var $uploadProgressBar = $element.siblings('.media_outlet_upload_progress_bar');
                var $uploadProgressInfo = $element.siblings('.media_outlet_upload_progress_info');

                $uploadProgressBar.fadeIn();
                $uploadProgressInfo.fadeIn();

                //Gets the media outlet div DOM element for use in callback functions
                var $mediaOutlet = $element.parent().siblings('.media_outlet_media_preview').parent('div');

                //HTTP POST upload request with AJAX
                $.ajax({
                    type: "POST",
                    url: params.urlService,
                    headers:
                    {
                         "Content-Type":"application/octet-stream",
                         //Customs headers
                         //The "X-..." notation is deprecated
                         "Uploaded-File-Location": params.uploadDir, //File location on the server
                         "Uploaded-File-Name": serverFileName, //File name on the server
                    },
                    data: file,
                    processData: false,
                    dataType: 'text',
                    success: function(data) 
                    {
                        $uploadProgressInfo.text('Upload terminé');

                        //The response contains the absolute URL of the uploaded file
                        var mediaUrl = data + '/' + serverFileName;

                        //Generates the media preview
                        generatesPreview($element.parent().siblings('.media_outlet_media_preview'), mediaType, mediaUrl, params.noPreviewImage);

                        //If the success callback function is defined, it's called with the upload result information
                        if (params.onSuccess)
                        {

                            var successInformation = {
                                mediaName:serverFileName,
                                mediaType:mediaType,
                                mediaUrl:mediaUrl,
                                mediaSelectionType:'upload'
                            };
                            params.onSuccess(successInformation, $mediaOutlet);
                        }

                    },
                    error: function(result, status, error)
                    {
                        $uploadProgressInfo.text('Erreur durant l\'upload');

                        //If the error callback function is defined, it's called with the error information
                        if (params.onError)
                        {
                            params.onError(error, $mediaOutlet);
                        }

                    },
                    xhr: function()
                    {
                         //Gets the native XmlHttpRequest object
                         var xhr = $.ajaxSettings.xhr() ;
                         //Sets the onprogress event handler
                         xhr.upload.onprogress = function(uploadEvent)
                         { 
                             $uploadProgressBar.attr('value', uploadEvent.loaded/uploadEvent.total*100); 
                             $uploadProgressInfo.text('Upload en cours : ' + parseInt(uploadEvent.loaded/uploadEvent.total*100) + '%');
                         };
                         //Returns the customized object
                         return xhr ;
                     }
                 });
            }

        }
        else
        {
            console.debug('ERROR : You must specify the URL of the script to call for file upload');
        }
    }
    
    
    /**
     * Generates the DOM elements of the uploader
     * 
     * @param $mediaOutlet the current media outlet DOM element
     * @param ^params the parameters
     * @returns 
     */
    function generatesUploaderElements($mediaOutlet, params)
    {
        
        //Generates the preview zone
        $mediaOutlet.append('<div class="media_outlet_media_preview"><div class="media_outlet_image_preview"><img src=""></div><div class="media_outlet_youtube_preview"><iframe width="300" height="200" src="" frameborder="0" allowfullscreen></iframe></div><div class="media_outlet_no_preview"><img src=""></div></div>');
           
        //Gets the media type of the preview source file contained in the custom attribute of the media outlet div DOM element, if it's specified
        if (params.loadedMedia)
        {
            var loadedMedia = params.loadedMedia;
            var mediaUrl = $mediaOutlet.attr(loadedMedia);
            var mediaType = getMediaType($mediaOutlet.attr(loadedMedia));
        }
        //Otherwise, there's no media to display at the page loading
        else
        {
            var mediaUrl = null;
            var mediaType = null;
        }

        var $mediaPreview = $mediaOutlet.children('.media_outlet_media_preview');
        generatesPreview($mediaPreview, mediaType, mediaUrl, params.noPreviewImage);
                
        //MEDIA SOURCE CHOICE
        $mediaOutlet.append('<input type="radio" class="media_outlet_upload_option" name="sourceType" value="upload" />Télécharger depuis l \'ordinateur');    
        $mediaOutlet.append('<input type="radio" class="media_outlet_url_option" name="sourceType" value="url" />Saisir une URL');
        
        //UPLOAD MODE
        $mediaOutlet.append('<div class="media_outlet_upload_mode"><input type="file" value="Choisir un fichier" class="media_outlet_button_upload" /><progress class="media_outlet_upload_progress_bar" value="0" max="100"></progress><p class="media_outlet_upload_progress_info"></p></div>');
        
        //URL MODE    
        $mediaOutlet.append('<div class="media_outlet_url_mode">Saisir une URL : <input type="text" class="media_outlet_input_url" value="http://" /><input type="button" class="media_outlet_button_validate_url_media" value="Valider" /></div>');
        
    }
    
    
    /**
     * Generate HTML code to display a preview of the media
     * 
     * @param $mediaPreview the media preview DOM element
     * @param mediaType the media type
     * @param mediaUrl the media URL
     * @param noPreviewImage the no preview image URL
     * 
     */
    function generatesPreview($mediaPreview, mediaType, mediaUrl, noPreviewImage)
    {
        //Hides all the preview zones
        $mediaPreview.find('div').hide();
        
        if (mediaUrl)
        {
            //If the media is an image
            if (mediaType === 'jpg' || mediaType === 'png' || mediaType === 'gif')
            {
                $mediaPreview.find('.media_outlet_image_preview img').attr('src', mediaUrl);
                $mediaPreview.find('.media_outlet_image_preview').show();
            }
            
            //If the media is a youtube video
            else if (mediaType === 'youtube')
            {
                //Gets the video id
                var splittedUrl = mediaUrl.split('=');
                var idVideo = splittedUrl[splittedUrl.length-1];
                
                $mediaPreview.find('iframe').attr('src', '//www.youtube.com/embed/' + idVideo);
                $mediaPreview.find('.media_outlet_youtube_preview').show();
            }
            //If the media is not supported by the plugin
            else
            {
                //If a no preview image is set
                if (noPreviewImage)
                {
                    var noPreviewImageUrl = null
                    
                    //No preview image URL is set in a data attribute
                    if (noPreviewImage.indexOf('data-') === 0)
                    {
                        noPreviewImageUrl = $mediaPreview.parent('div[' + noPreviewImage + ']').attr(noPreviewImage);
                    }
                    //No preview image URL is directly set in the parameters
                    else
                    {
                        noPreviewImageUrl = noPreviewImage;
                    }
                    
                    //Sets the no preview image
                    $mediaPreview.find('.media_outlet_no_preview img').attr('src', noPreviewImageUrl);
                }
                
                $mediaPreview.find('.media_outlet_no_preview').show();
            }
        }
        
    }
    

})(jQuery);