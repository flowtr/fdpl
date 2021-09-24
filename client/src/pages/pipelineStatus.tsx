import { useGetPipelineStatusQuery } from "../generated/graphql";
import { Flex, Skeleton, Heading, Text, Circle } from "@chakra-ui/react";
import { useEffect } from "preact/hooks";
import { headerCase } from "change-case";

export const PipelineStatusPage = ({ id }: { id: string }) => {
  const { data, error, loading } = useGetPipelineStatusQuery({
    variables: {
      job: {
        jobId: id,
      },
    },
  });

  useEffect(() => console.log(loading), [loading]);

  return (
    <Flex
      bg="gray.800"
      w="full"
      h="100vh"
      p="1.5em"
      flexDir="column"
      justifyContent="flex-start"
      alignItems="flex-start"
    >
      {error && (
        <>
          <Text>{error.message}</Text>
        </>
      )}
      <Skeleton isLoaded={!loading}>
        {data && (
          <>
            <Flex
              flexDir="row"
              justifyContent="center"
              alignItems="center"
              mb="0.5em"
            >
              <Heading size="2xl">
                {headerCase(data.getPipelineStatus.name)}
              </Heading>
              <Circle
                ml="1.5em"
                size="1.5em"
                bg={
                  data.getPipelineStatus.state.toLowerCase() === "completed"
                    ? "green"
                    : data.getPipelineStatus.state.toLowerCase() === "failed"
                    ? "red"
                    : "yellow"
                }
              />
            </Flex>

            <Heading size="lg" mr="1.5em">
              Status
            </Heading>
            <Text>
              {data.getPipelineStatus.state.toLowerCase() === "completed"
                ? "Successful"
                : data.getPipelineStatus.state.toLowerCase() === "failed"
                ? "Failed"
                : headerCase(data.getPipelineStatus.state)}
            </Text>
          </>
        )}
      </Skeleton>
    </Flex>
  );
};
