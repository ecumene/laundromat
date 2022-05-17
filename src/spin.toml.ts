import toml from "toml";

export type SpinComponent = {
  id: string;
  source: string;
  trigger: {
    route: string;
  };
};

export type SpinToml = {
  spin_version: string;
  authors: string[];
  name: string;
  trigger: {
    type: string;
    base: string;
  };
  version: string;
  component: SpinComponent[];
};

export default async (): Promise<SpinToml> => {
  const source = await fetch("/app/spin.toml");
  const spin = toml.parse(await source.text());
  return spin;
};
