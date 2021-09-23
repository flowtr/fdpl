export interface Filter<T> {
  $include?: {
    [K in keyof T]?: boolean;
  };
}

export const filter =
  <T, F extends Filter<T> = Filter<T>>(query: F) =>
  (data: Array<T>) => {
    let finalData: Array<Partial<T>> = data;
    const includeFilter = query.$include;
    if (includeFilter) {
      finalData = data.map((obj) =>
        Object.keys(obj).reduce((o, key) => {
          if (includeFilter[key as keyof T] === true)
            o[key as keyof Partial<T>] = obj[key as keyof T];
          return o;
        }, {} as Partial<T>)
      );
    }

    return finalData;
  };
