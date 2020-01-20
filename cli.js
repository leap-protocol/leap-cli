#!node
// Copyright © 2020 Hoani Bryson
// License: MIT (https://mit-license.org/)
//
// CLI
//
// User facing command line interface
//

const loadConfig = require('./src/loadConfig');
const fs = require('fs');
const cli_parse = require("./src/cliParse");
const leap = require("leap-protocol");
const directory = require('path').dirname(__filename);

const EXIT_SUCCESS = 0;
const EXIT_FAILURE = 1;


// fetch a config file's data based on filename extension
function fetch_default_config(filename) {
  let data = null;

  if (/.json$/.exec(filename) !== null) {
    data = fs.readFileSync(
      directory + '/src/generate.json'
    );
  }
  else if (/.toml$/.exec(filename) !== null) {
    data = fs.readFileSync(
      directory + '/src/generate.toml'
    );
  }
  else if (/.yaml$/.exec(filename) !== null) {
    data = fs.readFileSync(
      directory + '/src/generate.yaml'
    );
  }

  return data;
}

// Generate the specified filetype
function handle_generate(filename) {
  const data = fetch_default_config(filename);

  if (data == null) {
    console.log(
      `Failed to write config file to ${filename}. `+
      `Please specify a yaml, json or toml filename.`
    )
    return false;
  }
  else {
    console.log(`Wrote config file to ${filename}`);
    fs.writeFileSync(filename, data);
  }

  return true;
}

function load_config(filename) {
  const loader = new loadConfig.LoadConfig(filename);
  return loader;
}

// Verify the specified file
function handle_verify(filename) {
  const loader = load_config(filename);
  if (loader.valid()) {
    return leap.verify(loader.config());
  }
}

// Encode a packet
function handle_encode(filename, category, address, payload) {
  const loader = load_config(filename);
  if (loader.valid() == true) {
    const c = new leap.Codec(loader.config());
    if (c.valid() == false) {
      leap.verify(loader.config());
    }
    else {
      const p = new leap.Packet(category, address, payload);
      const encoded = c.encode(p);
      if (encoded.length !== 0) {
        console.log(``+
          `Encoded Packet ( ${category}, ${address}, [${payload.toString()}]):\n`+
          `${encoded}`
        );
        return true;
      }
    }
  }
  return false;
}

// Decode a packet
function handle_decode(filename, encoded) {
  const loader = load_config(filename);
  if (loader.valid() == true) {
    const c = new leap.Codec(loader.config());
    if (c.valid() == false) {
      leap.verify(loader.config());
    }
    else {
      try {
        const [_, packets] = c.decode(encoded + c._config["end"]);
        if (packets.length !== 0){
          for (p of packets) {
            const u = c.unpack(p);

            console.log(
              `Decoded Packet <${encoded}>:\n`+
              `   category - ${p.category}`
            );
            Object.keys(u).forEach(function(key) {
              console.log(
                `   address "${key}" = ${u[key]}`
              );
            });
          }
          return true;
        }
        else {
          throw Error;
        }
      }
      catch {
        console.log(
          `   Decode of <${encoded}> failed.\n`+
          `   please check if you are using the correct config file.`
        );
      }
    }
  }
  return false;
}


const settings = cli_parse.cli_parse();

let success = false;

if ("generate" in settings) {
  success = handle_generate(settings.generate);
}

if ("verify" in settings) {
  if (settings.verify != null) {
    success = handle_verify(settings.verify);
  }
}

if ("encode" in settings) {
  if (settings.encode != null) {
    if (settings.payload == null) {
      settings.payload = [];
    }
    success = handle_encode(
      settings.encode,
      settings.category,
      settings.address,
      settings.payload
    );
  }
}

if ("decode" in settings) {
  if (settings.decode != null) {
    success = handle_decode(
      settings.decode,
      settings.packet
    );
  }
}

if (success) {
  process.exit(EXIT_SUCCESS);
}
else {
  process.exit(EXIT_FAILURE);
}

