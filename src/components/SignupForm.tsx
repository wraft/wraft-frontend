import React from 'react';
import { Box, Flex, Button, Text, Link as LinkBase } from 'rebass';
import Link from 'next/link';
import { useForm } from 'react-hook-form';

import { Label, Input } from '@rebass/forms';
import { registerUser } from '../utils/models';

export interface IField {
  name: string;
  value: string;
}

const Form = () => {
  const { register, handleSubmit, errors } = useForm();
  
  const onSignup = () => {
    console.log('signed up');
  }

  const onSubmit = (data: any) => {
    registerUser(data, onSignup)
  };

  return (
    <Box
      as="form"
      onSubmit={handleSubmit(onSubmit)}
      py={3}
      width={4 / 12}
      mt={4}>
      <Text variant="pagetitle">
        Join Wraft
      </Text>
      <Box mx={0} mb={3}>
        <Box width={1} px={2} pb={3}>
          <Label htmlFor="email" mb={1}>
            Name
          </Label>
          <Input
            id="name"
            name="name"
            defaultValue="Muneef Hameed"
            ref={register({ required: true })}
          />
        </Box>
        <Box width={1} px={2} pb={3}>
          <Label htmlFor="email" mb={1}>
            Email
          </Label>
          <Input
            id="email"
            name="email"
            defaultValue="john@doe.com"
            ref={register({ required: true })}
          />
        </Box>
        <Box width={1} px={2} pb={3}>
          <Label htmlFor="token" mb={1}>
            Token
          </Label>
          <Input
            id="token"
            name="token"
            defaultValue="SFMyNTY.g3QAAAACZAAEZGF0YXQAAAACZAAFZW1haWxtAAAAD2hlbGxvQGF1cnV0LmNvbWQADG9yZ2FuaXNhdGlvbnQAAAATZAAIX19tZXRhX190AAAABmQACl9fc3RydWN0X19kABtFbGl4aXIuRWN0by5TY2hlbWEuTWV0YWRhdGFkAAdjb250ZXh0ZAADbmlsZAAGcHJlZml4ZAADbmlsZAAGc2NoZW1hZAAnRWxpeGlyLldyYWZ0RG9jLkVudGVycHJpc2UuT3JnYW5pc2F0aW9uZAAGc291cmNlbQAAAAxvcmdhbmlzYXRpb25kAAVzdGF0ZWQABmxvYWRlZGQACl9fc3RydWN0X19kACdFbGl4aXIuV3JhZnREb2MuRW50ZXJwcmlzZS5PcmdhbmlzYXRpb25kAAdhZGRyZXNzbQAAABUjMjQsIENhcmF2ZWwgQnVpbGRpbmdkABBhcHByb3ZhbF9zeXN0ZW1zdAAAAARkAA9fX2NhcmRpbmFsaXR5X19kAARtYW55ZAAJX19maWVsZF9fZAAQYXBwcm92YWxfc3lzdGVtc2QACV9fb3duZXJfX2QAJ0VsaXhpci5XcmFmdERvYy5FbnRlcnByaXNlLk9yZ2FuaXNhdGlvbmQACl9fc3RydWN0X19kACFFbGl4aXIuRWN0by5Bc3NvY2lhdGlvbi5Ob3RMb2FkZWRkAAxjb3Jwb3JhdGVfaWRkAANuaWxkAAVlbWFpbG0AAAAPaGVsbG9AYXVydXQuY29tZAAFZ3N0aW5kAANuaWxkAAJpZGEBZAALaW5zZXJ0ZWRfYXR0AAAACWQACl9fc3RydWN0X19kABRFbGl4aXIuTmFpdmVEYXRlVGltZWQACGNhbGVuZGFyZAATRWxpeGlyLkNhbGVuZGFyLklTT2QAA2RheWEWZAAEaG91cmEIZAALbWljcm9zZWNvbmRoAmEAYQBkAAZtaW51dGVhBGQABW1vbnRoYQZkAAZzZWNvbmRhLmQABHllYXJiAAAH5GQACmxlZ2FsX25hbWVtAAAAGEZ1bmN0aW9uYXJ5IExhYnMgUHZ0IEx0ZGQABGxvZ29kAANuaWxkAARuYW1lbQAAABlGdW5jdGlvbmFyeSBMYWJzIFB2dCBMdGQuZAALbmFtZV9vZl9jZW9tAAAADU11bmVlZiBIYW1lZWRkAAtuYW1lX29mX2N0b20AAAALU2Fsc2FiZWVsIEtkAAVwaG9uZWQAA25pbGQACXBpcGVsaW5lc3QAAAAEZAAPX19jYXJkaW5hbGl0eV9fZAAEbWFueWQACV9fZmllbGRfX2QACXBpcGVsaW5lc2QACV9fb3duZXJfX2QAJ0VsaXhpci5XcmFmdERvYy5FbnRlcnByaXNlLk9yZ2FuaXNhdGlvbmQACl9fc3RydWN0X19kACFFbGl4aXIuRWN0by5Bc3NvY2lhdGlvbi5Ob3RMb2FkZWRkAAp1cGRhdGVkX2F0dAAAAAlkAApfX3N0cnVjdF9fZAAURWxpeGlyLk5haXZlRGF0ZVRpbWVkAAhjYWxlbmRhcmQAE0VsaXhpci5DYWxlbmRhci5JU09kAANkYXlhFmQABGhvdXJhCGQAC21pY3Jvc2Vjb25kaAJhAGEAZAAGbWludXRlYQRkAAVtb250aGEGZAAGc2Vjb25kYS5kAAR5ZWFyYgAAB-RkAAV1c2Vyc3QAAAAEZAAPX19jYXJkaW5hbGl0eV9fZAAEbWFueWQACV9fZmllbGRfX2QABXVzZXJzZAAJX19vd25lcl9fZAAnRWxpeGlyLldyYWZ0RG9jLkVudGVycHJpc2UuT3JnYW5pc2F0aW9uZAAKX19zdHJ1Y3RfX2QAIUVsaXhpci5FY3RvLkFzc29jaWF0aW9uLk5vdExvYWRlZGQABHV1aWRtAAAAJDkyOWY0Y2QyLWU0NmMtNGUxNy1iYjkyLTEyY2VlZjY4NWM1MmQABnNpZ25lZG4GAJiVvTJ1AQ.2eDMcmIR243NJl1naO65zFywUjinUaFkAkmIX0C44vI"
            ref={register({ required: true })}
          />
        </Box>
        <Box width={1} px={2}>
          <Label htmlFor="password" mb={1}>
            Password
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            ref={register({ required: true })}
          />
        </Box>

        {errors.exampleRequired && <Text>This field is required</Text>}
        <Flex mx={-2} flexWrap="wrap" mt={2}>
          <Button type="submit" ml={2}>
            Join Now
          </Button>
          <Text pl={3} pt={2}>
            Already a user ?{' '}
            <LinkBase href="login" as={Link}>
              Sign in
            </LinkBase>
          </Text>
        </Flex>
      </Box>
    </Box>
  );
};
export default Form;
