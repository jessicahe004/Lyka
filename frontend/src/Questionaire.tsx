import React from 'react';
import { Box, FormControl, FormLabel, Input, Select, Textarea, Checkbox, CheckboxGroup } from '@chakra-ui/react';

interface QuestionnaireProps {
  questionnaire: {
    id: string;
    treatment: string;
    symptoms: string[];
    additionalInfo: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleSymptomsChange: (selectedSymptoms: string[]) => void;
}

const symptomsOptions = [
  'Headache',
  'Nausea',
  'Dizziness',
  'Fatigue',
  'Fever',
  'Chills',
  'Cough',
  'Shortness of breath',
  'Chest pain',
  'Other',
];

const Questionnaire: React.FC<QuestionnaireProps> = ({
  questionnaire,
  handleInputChange,
  handleSelectChange,
  handleSymptomsChange
}) => {
  return (
    <Box mb={8} w="100%">
      <FormControl mb={4} isRequired>
        <FormLabel>ID</FormLabel>
        <Input 
          name="id"
          value={questionnaire.id}
          onChange={handleInputChange}
          placeholder="Enter your ID"
        />
      </FormControl>

      <FormControl mb={4} isRequired>
        <FormLabel>Treatment Type</FormLabel>
        <Select
          name="treatment"
          value={questionnaire.treatment}
          onChange={handleSelectChange}
          placeholder="Select treatment type"
        >
          <option value="medication-prescribed">Medication prescribed by a doctor</option>
          <option value="cultural-medication">Cultural medication</option>
          <option value="cultural-exercise-rest">Cultural exercise/rest</option>
          <option value="exercise-rest-prescribed">Exercise/rest prescribed by a doctor</option>
        </Select>
      </FormControl>

      <FormControl mb={4} isRequired>
        <FormLabel>Symptoms</FormLabel>
        <CheckboxGroup
          colorScheme="teal"
          onChange={handleSymptomsChange}
          value={questionnaire.symptoms}
        >
          {symptomsOptions.map(symptom => (
            <Checkbox key={symptom} value={symptom}>
              {symptom}
            </Checkbox>
          ))}
        </CheckboxGroup>
      </FormControl>

      <FormControl mb={4}>
        <FormLabel>Additional Information</FormLabel>
        <Textarea
          name="additionalInfo"
          value={questionnaire.additionalInfo}
          onChange={handleInputChange}
          placeholder="Any additional information"
        />
      </FormControl>
    </Box>
  );
};

export default Questionnaire;
