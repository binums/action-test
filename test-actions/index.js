const fetch = require("node-fetch")

const HASURA_OPERATION = `
mutation actionTest($name: String, $colour: String, $pretty3: String ) {
  insert_test1_one(object: {
    name: $name,
    colour: $colour
    pretty3: $pretty3
  }) {
    id
    name
    colour
    pretty3
  }
}
`;

const execute = async (variables) => {
  const fetchResponse = await fetch(
    "https://test-events-local.herokuapp.com/v1/graphql",
    {
      method: 'POST',
      body: JSON.stringify({
        query: HASURA_OPERATION,
        variables
      })
    }
  );
  const data = await fetchResponse.json();
  console.log('DEBUG: ', data);
  return data;
};

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const { name, colour } = req.body.input;
    const pretty3 = name.trim().replace(" ","+").concat("-",colour).toUpperCase()
    const { data, errors } = await execute({ name, colour, pretty3 });

    if (errors) {
        context.res = {
            ...errors[0]
        };
    } else {
        context.res = {
            ...data.insert_test1_one
        };
    }
};
