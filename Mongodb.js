db.getCollection('catalog_products_naj-dekoltsk').aggregate([{
    $match: 
    {
        status: 'scraped'
    }
},
{
    $group: 
    {
            _id: "$active",
            count: { $sum: 1 }
    }
}
])

db.getCollection('catalog_products_ludorask').find(
	{ $and: 
		[
			{ status: 'scraped' },
			{ active: { $exists: false } } 
		] 
	}
).count()

db.getCollection('catalog_products_ludorask-dekoltsk').update(
	{ $and: 
		[
			{ status: 'scraped' },
			{ active: { $exists: false } } 
		] 
	},
        {
            $set: {
                active: 1,
                changed: 0
            }
        },
        {multi: true}
)

db.getCollection('catalog_products_ludorask').update({status: 'scraped'}, {$set: {changed: 0}}, {multi: true})


db.getCollection('catalog_products_naj-dekoltsk').aggregate([{
    $match: 
    {
        status: 'rechecked'
    }
},
{
    $group: 
    {
            _id: {
                active: "$active",
                changed: '$changed'
            },
            count: { $sum: 1 }
    }
}
])