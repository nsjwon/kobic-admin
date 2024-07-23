// VERSION 2021.09.14 (youtube, vimeo)
// vanilla regex
var OEMBED_PROVIDER =
[
    {
        "provider_name": "YouTube",
        "provider_url": "https://www.youtube.com/",
        "endpoints": [
            {
                "schemes": [
                    /https:\/\/.*youtube\.com\/watch.*/gi,
                    /https:\/\/.*youtube\.com\/v\/.*/gi,
                    /https:\/\/youtu.be\/.*/gi,
                    /https:\/\/.*youtube\.com\/playlist\?list=.*/gi
                ],
                "url": "https://www.youtube.com/oembed?format={format}&url={url}",
                "discovery": true
            }
        ]
    },
	{
        "provider_name": "Vimeo",
        "provider_url": "https://vimeo.com/",
        "endpoints": [
            {
                "schemes": [
                    /https:\/\/vimeo\.com\/.*/gi,
                    /https:\/\/vimeo\.com\/album\/.*\/video\/.*/gi,
                    /https:\/\/vimeo\.com\/channels\/.*\/.*/gi,
                    /https:\/\/vimeo\.com\/giroups\/.*\/videos\/.*/gi,
                    /https:\/\/vimeo\.com\/ondemand\/.*\/.*/gi,
                    /https:\/\/player\.vimeo\.com\/video\/.*/gi
                ],
                "url": "https://vimeo.com/api/oembed.{format}?url={url}",
                "discovery": true
            }
        ]
    },
]