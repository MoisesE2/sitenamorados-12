import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserRegistrationForm } from "@/components/forms/user-registration-form";
import { Users } from "lucide-react";

const RegistrationSection = () => {
  return (
    <Card className="shadow-xl transform hover:scale-105 transition-transform duration-300 ease-out">
      <CardHeader>
        <div className="flex items-center space-x-2 mb-2">
          <Users className="h-8 w-8 text-primary" />
          <CardTitle className="font-headline text-3xl text-primary">Crie Sua Conta</CardTitle>
        </div>
        <CardDescription className="font-body text-muted-foreground">
          Registre-se para personalizar sua página e compartilhar seus momentos.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <UserRegistrationForm />
      </CardContent>
    </Card>
  );
};

export default RegistrationSection;
