# adonisjs-querify

Provide controller and model to handle basic crud operations and enriched api get sql search from query string in url in [Adonis.js](https://adonisjs.com/)

## Installation
Make sure to install it using npm or yarn.

```
# npm
npm i adonisjs-querify

# yarn
yarn add adonisjs-queryfy
```

## How to use
You should register the installed package as a provider in  `start/app.js` file

```
const providers = [
 ...
  'adonisjs-querify/providers/Provider'
  ...
]
```

Then you can use the available components to extend your models and controllers

### Models

```
const Model = use('Freesgen/Adonis/BaseModel')
const Database = use('Database')

class TimeEntry extends Model {
 // your stuff here ...
}
```
### Controllers

```
'use strict'
const BaseController = use('Freesgen/BaseController');
const TimeEntry = use('App/Models/TimeEntry')

class TimeEntryController extends BaseController{

  constructor() {
    super(TimeEntry)
  }
```

### Hit your endpoints

`/api/v1/time-entries?relationships=labels&sort=-start&limit=1`

In this case I am calling my endpioint with relationship and limit parameters. and you get the resource.

```
  {
    "id": 34,
    "id_company": 3,
    "user_id": 3,
    "milestone_id": null,
    "label_ids": [
      3
    ],
    "description": "Otra cosa mas",
    "billable": 1,
    "start": "2019-08-04T01:41:41.000Z",
    "end": "2019-08-04T01:41:53.000Z",
    "status": 1,
    "duration": null,
    "created_at": "2019-08-03 21:41:41",
    "updated_at": "2019-08-03 21:41:53",
    "labels": [
      {
        "id": 3,
        "id_company": 3,
        "title": "Otra cosa",
        "description": "Otra cosa",
        "color": "#f6f6f6",
        "color_format": "hex",
        "created_at": "2019-08-03 18:34:34",
        "updated_at": "2019-08-03 18:34:34",
        "pivot": {
          "label_id": 3,
          "time_entry_id": 34
        }
      }
    ]
  }
```

## Queryfy calls params
### filter
filter[]=value&filter[field]=value

#### like
filter[]=%value%
#### greater than
filter[field]=>value&filter
#### minor than
filter[field]=<value&filter
 
### Sort
`{url}?sort=field` for ASC, `{url}?sort=field` for DESC

###
