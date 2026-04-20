import { useState } from "react";
import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { type AuthMode, useSignIn } from "../hooks/use-sign-in";

type Props = {
  mode: AuthMode;
};

export function SignInForm({ mode }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const { mutate, isPending, error } = useSignIn();

  return (
    <>
      <View className="mt-s-4 gap-s-3">
        {mode === "up" ? (
          <Field
            icon="user"
            placeholder="Full name"
            autoCapitalize="words"
            value={name}
            onChangeText={setName}
          />
        ) : null}
        <Field
          icon="mail"
          placeholder="Email address"
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <Field
          icon="clock"
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        {error ? (
          <Text variant="body-sm" className="text-[#b42318]">
            {error}
          </Text>
        ) : null}
      </View>

      <View className="mt-s-4">
        <Button
          label={mode === "in" ? "Sign in" : "Create account"}
          trailing={<Icon name="arrow" size={16} color="#fff" />}
          loading={isPending}
          onPress={() => mutate({ mode, email, password, name })}
        />
      </View>
    </>
  );
}
