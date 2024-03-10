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
    packages = forEachSystem (pkgs: {
      default = pkgs.buildNpmPackage {
        pname = "webnodes";
        version = "0.1.0";
        src = ./.;
      };
    });
  };
}
