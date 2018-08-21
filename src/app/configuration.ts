import { Prefix } from './sparql-services/sparql-parser.service';

export const GlobalVariables = Object.freeze({
    // Database relative informations
    TRIPLESTORE : {
            'dsn' : 'http://147.99.7.61:8890/sparql',
        },
    ONTOLOGY_PREFIX : {
        // Prefix
        'rdfs'  : {prefix : 'rdfs',  uri : 'http://www.w3.org/2000/01/rdf-schema#' },
        'skos'  : {prefix : 'skos',  uri : 'http://www.w3.org/2004/02/skos/core#' },
        'foaf'  : {prefix : 'foaf',  uri : 'http://xmlns.com/foaf/0.1/' },

    },
    /*
    Request used to find all top level individuals on a SKOS taxonomy
        PREFIX skos: <http://www.w3.org/2004/02/skos/core#> 
        select distinct ?firstBorn ?label where {
        ?firstBorn skos:narrower ?child .
        ?firstBorn skos:prefLabel ?label .
        FILTER NOT EXISTS {?god skos:narrower ?firstBorn}
        FILTER  (lang(?label) = 'en')
        } LIMIT 100
        */
    NAMED_INDIVIDUALS : {
        // 'taxonomic_classification_of_organisms':                new UniqueIdentifier({uri: 'http://lod.nal.usda.gov/nalt/127293',name: 'Taxonomic Classification of Organisms'}),
        // 'animal_science_and_animal_products' :                  new UniqueIdentifier({uri: 'http://lod.nal.usda.gov/nalt/127295',name: 'Animal Science and Animal Products'}),
        // 'breeding_and_genetic_improvement' :                    new UniqueIdentifier({uri: 'http://lod.nal.usda.gov/nalt/127296',name: 'Breeding and Genetic Improvement'}),
        // 'economics_business_and_industry':                      new UniqueIdentifier({uri: 'http://lod.nal.usda.gov/nalt/127297',name: 'Economics, Business and Industry'}),
        // 'farms_and_farming_systems':                            new UniqueIdentifier({uri: 'http://lod.nal.usda.gov/nalt/127298',name: 'Farms and Farming Systems'}),
        // 'food_and_human_nutrition':                             new UniqueIdentifier({uri: 'http://lod.nal.usda.gov/nalt/127299',name: 'Food and Human Nutrition'}),
        // 'forest_science_and_forest_products':                   new UniqueIdentifier({uri: 'http://lod.nal.usda.gov/nalt/127300',name: 'Forest Science and Forest Products'}),
        // 'geographical_locations':                               new UniqueIdentifier({uri: 'http://lod.nal.usda.gov/nalt/127301',name: 'Geographical Locations'}),
        // 'government_law_and_regulations':                       new UniqueIdentifier({uri: 'http://lod.nal.usda.gov/nalt/127302',name: 'Government, Law and Regulations'}),
        // 'health_and_pathology':                                 new UniqueIdentifier({uri: 'http://lod.nal.usda.gov/nalt/127303',name: 'Health and Pathology'}),
        // 'insects_and_entomology':                               new UniqueIdentifier({uri: 'http://lod.nal.usda.gov/nalt/127304',name: 'Insects and Entomology'}),
        // 'natural_resources_earth_and_environmental_sciences':   new UniqueIdentifier({uri: 'http://lod.nal.usda.gov/nalt/127305',name: 'Natural Resources, Earth and Environmental Sciences'}),
        // 'physical_and_chemical_sciences':                       new UniqueIdentifier({uri: 'http://lod.nal.usda.gov/nalt/127306',name: 'Physical and Chemical Sciences'}),
        // 'plant_science_and_plant_products':                     new UniqueIdentifier({uri: 'http://lod.nal.usda.gov/nalt/127307',name: 'Plant Science and Plant Products'}),
        // 'research_technology_and_engineering':                  new UniqueIdentifier({uri: 'http://lod.nal.usda.gov/nalt/127308',name: 'Research, Technology and Engineering'}),
        // 'rural_and_agricultural_sociology':                     new UniqueIdentifier({uri: 'http://lod.nal.usda.gov/nalt/127309',name: 'Rural and Agricultural Sociology'}),
        // 'biological_sciences':                                  new UniqueIdentifier({uri: 'http://lod.nal.usda.gov/nalt/127348',name: 'Biological Sciences'}),
    },
    LITTERALS_TYPE : {
        STRING: "xsd^^string",
    }
});

export function hash32(stringToEncode : string)
{
	let  hash = 0;
	if (stringToEncode.length == 0) return hash;
	for (let i = 0; i < stringToEncode.length; i++) {
		let char = stringToEncode.charCodeAt(i);
		hash = ((hash<<5)-hash)+char;
		hash = hash & hash; // Convert to 32bit integer
	}
	return hash;
}


