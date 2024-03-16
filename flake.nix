{
  description = "Celeste key overlay";
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
  outputs = { self, nixpkgs }: let
    systems = ["aarch64-darwin" "aarch64-linux" "x86_64-darwin" "x86_64-linux"];
    forEachSystem = fn: lib.genAttrs systems (system: fn (import nixpkgs {inherit system;}));
    inherit (nixpkgs) lib;
  in {
    devShells = forEachSystem (pkgs: {
      default = pkgs.mkShell {
        name = "key-overlay";
        packages = with pkgs; [
          bun
          typescript
          assemblyscript
          esbuild
        ];
      };
    });
    packages = forEachSystem (pkgs: rec {
      default = pkgs.buildNpmPackage {
        pname = "webnodes";
        version = "0.1.0";
        src = ./.;
        #forceEmptyCache = true;
        npmDepsHash = "sha256-hiGb2+LpdxNs36aiB/aEX3MarEFidMezrmxzutulmVw=";
      };
      image = pkgs.dockerTools.buildLayeredImage {
	name = "webnodes";
	tag = "latest";
	config.Cmd = [
	  "${pkgs.pkgsStatic.pocketbase}/bin/pocketbase"
	  "--http" "0.0.0.0:8000"
	  #"--publicDir" "${default}/lib/node_modules/webnodes"
	];
      };
    });
  };
}
